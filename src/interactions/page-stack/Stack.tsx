import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import { useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { useOnClickOutside } from "usehooks-ts";
import Card from "./Card";
import { getStackPeekOffsets, getStackPositions } from "./positions";

const cards = [
	{
		width: 500,
		backgroundClass: "bg-base-100",
		content: <div></div>,
	},
	{
		width: 500,
		backgroundClass: "bg-base-100",
		content: <div></div>,
	},
	{
		width: 400,
		backgroundClass: "bg-base-100",
		content: <div></div>,
	},
];

const Stack = () => {
	const [activeIndex, setActiveIndex] = useState(-1);
	const [peekedIndex, setPeekedIndex] = useState<number | null>(null);
	const stackRef = useRef<HTMLDivElement>(null);
	const [containerRef, containerBounds] = useMeasure();

	const isMobile = containerBounds.width < 768;

	const peekHeight = 80;

	const baseStackPositions = useMemo(() => {
		if (isMobile) {
			const offscreenPos = containerBounds.height + 100;
			const peekPos = containerBounds.height - peekHeight;

			return cards.map((_, index) => {
				if (activeIndex === -1) {
					return index === 0 ? peekPos : offscreenPos;
				}

				if (index <= activeIndex) {
					return 0;
				}

				if (index === activeIndex + 1) {
					return peekPos;
				}

				return offscreenPos;
			});
		}

		return getStackPositions(
			activeIndex,
			cards.length,
			containerBounds.width,
			5,
			2,
			cards.map((card) => card.width),
		);
	}, [isMobile, activeIndex, containerBounds.width, containerBounds.height]);

	const currentDynamicOffsets = useMemo(() => {
		if (isMobile) return new Array(cards.length).fill(0);

		return getStackPeekOffsets(peekedIndex, activeIndex, cards.length);
	}, [isMobile, peekedIndex, activeIndex]);

	const orientation: "horizontal" | "vertical" = isMobile
		? "vertical"
		: "horizontal";

	const handleClickOutside = (event: Event) => {
		const target = event.target as HTMLElement | null;
		if (target && target.closest("[data-info-drawer]")) {
			return;
		}

		setActiveIndex(-1);
	};

	useOnClickOutside(
		stackRef as React.RefObject<HTMLElement>,
		handleClickOutside,
	);

	const handleCardClick = (index: number) => {
		if (isMobile) {
			if (index !== activeIndex) {
				setActiveIndex(index);
			}
		} else {
			setActiveIndex(index);
		}
	};

	const requestClose = () => {
		setActiveIndex((prev) => prev - 1);
	};

	const requestOpen = () => {
		setActiveIndex((prev) => Math.min(prev + 1, cards.length - 1));
	};

	return (
		<div ref={containerRef} className="bg-base-900 h-full w-full">
			<div ref={stackRef}>
				<AnimatePresence>
					{cards.map((card, index) => {
						return (
							<Card
								key={index}
								pos={baseStackPositions[index] + currentDynamicOffsets[index]}
								orientation={orientation}
								onMouseEnter={() => setPeekedIndex(index)}
								onMouseLeave={() => setPeekedIndex(null)}
								onClick={() => handleCardClick(index)}
								isDraggable={
									isMobile &&
									(index === activeIndex || index === activeIndex + 1)
								}
								onRequestClose={
									index === activeIndex ? requestClose : undefined
								}
								onRequestOpen={
									index === activeIndex + 1 ? requestOpen : undefined
								}
								className={cn(
									card.backgroundClass,
									index !== activeIndex && "cursor-alias",
								)}
								transitionDelay={
									index === activeIndex + 2 && isMobile ? 0.3 : 0
								}
							>
								{card.content}
							</Card>
						);
					})}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Stack;
