import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import Card from "./Card";
import { getStackPeekOffsets, getStackPositions } from "./positions";

const Stack = () => {
	const [activeIndex, setActiveIndex] = useState(-1);
	const [peekedIndex, setPeekedIndex] = useState<number | null>(null);
	const [numCards, setNumCards] = useState(4);
	const stackRef = useRef<HTMLDivElement>(null);
	const controlsRef = useRef<HTMLDivElement>(null);
	const [containerRef, containerBounds] = useMeasure();

	const isMobile = containerBounds.width < 768;

	const peekHeight = 80;

	const baseStackPositions = useMemo(() => {
		if (isMobile) {
			const offscreenPos = containerBounds.height + 100;
			const peekPos = containerBounds.height - peekHeight;

			return Array.from({ length: numCards }, (_, index) => {
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
			numCards,
			containerBounds.width,
			6,
			2,
			Array.from({ length: numCards }, () => 600),
		);
	}, [
		isMobile,
		activeIndex,
		containerBounds.width,
		containerBounds.height,
		numCards,
	]);

	const currentDynamicOffsets = useMemo(() => {
		if (isMobile) return new Array(numCards).fill(0);

		return getStackPeekOffsets(peekedIndex, activeIndex, numCards);
	}, [isMobile, peekedIndex, activeIndex, numCards]);

	const orientation: "horizontal" | "vertical" = isMobile
		? "vertical"
		: "horizontal";

	const handleClickOutside = (event: Event) => {
		const target = event.target as HTMLElement | null;
		if (target && target.closest("[data-info-drawer]")) {
			return;
		}

		if (target && controlsRef.current?.contains(target)) {
			return;
		}

		setActiveIndex(-1);
	};

	useEffect(() => {
		const handleClick = (event: Event) => {
			const target = event.target as HTMLElement | null;

			if (
				!stackRef.current?.contains(target) &&
				!target?.closest("[data-info-drawer]")
			) {
				handleClickOutside(event);
			}
		};

		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, []);

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
		setActiveIndex((prev) => Math.min(prev + 1, numCards - 1));
	};

	const addCard = () => {
		setNumCards((prev) => prev + 1);
		setActiveIndex(numCards);
	};

	const removeCard = () => {
		if (numCards > 0) {
			setNumCards((prev) => prev - 1);
			setActiveIndex((prev) => {
				const newNumCards = numCards - 1;
				if (prev >= newNumCards) {
					return Math.max(0, newNumCards - 1);
				}
				return prev;
			});
		}
	};

	return (
		<div ref={containerRef} className="bg-base-900 relative h-full w-full">
			<div ref={stackRef}>
				<AnimatePresence>
					{Array.from({ length: numCards }, (_, index) => (
						<Card
							key={index}
							index={index}
							pos={baseStackPositions[index] + currentDynamicOffsets[index]}
							orientation={orientation}
							onMouseEnter={() => setPeekedIndex(index)}
							onMouseLeave={() => setPeekedIndex(null)}
							onClick={() => handleCardClick(index)}
							isDraggable={
								isMobile && (index === activeIndex || index === activeIndex + 1)
							}
							onRequestClose={index === activeIndex ? requestClose : undefined}
							onRequestOpen={
								index === activeIndex + 1 ? requestOpen : undefined
							}
							isActive={index === activeIndex}
							className={cn(index !== activeIndex && "cursor-alias")}
							transitionDelay={index === activeIndex + 2 && isMobile ? 0.3 : 0}
						/>
					))}
				</AnimatePresence>
			</div>

			<div
				ref={controlsRef}
				className="absolute bottom-4 left-4 z-1000 flex flex-col"
			>
				<button
					onClick={addCard}
					className="bg-base-50 text-base-900 flex h-14 w-14 cursor-pointer items-center justify-center"
				>
					<Plus className="text-base-500 h-7 w-7" strokeWidth={1} />
				</button>
				<button
					onClick={removeCard}
					disabled={numCards <= 0}
					className="bg-base-50 text-base-900 border-base-200 flex h-14 w-14 cursor-pointer items-center justify-center border-t-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Minus className="text-base-500 h-7 w-7" strokeWidth={1} />
				</button>
			</div>
		</div>
	);
};

export default Stack;
