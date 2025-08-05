import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import { useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";
import { useOnClickOutside } from "usehooks-ts";
import Card from "./Card";
import { getStackPeekOffsets, getStackPositions } from "./positions";

import childImage from "./images/child.png";
import dishImage from "./images/dish.png";
import wokImage from "./images/wok.png";

const cards = [
	{
		width: 500,
		backgroundClass: "bg-[#56574B]",
		content: (
			<div className="flex h-full max-w-[500px] flex-col justify-between">
				<div className="flex flex-1 flex-col justify-between p-6">
					<div className="space-y-2">
						<h2 className="font-hedvig max-w-[400px] text-3xl text-[#FDF9FD]">
							"Even as a child, the scent of spices and the sizzle of a pan told
							me more stories than any book. That's where my journey truly
							began."
						</h2>
						<span className="text-right text-[#DDD7DD] italic">
							—Anan Saelee
						</span>
					</div>
					<div className="space-y-4">
						<p className="text-sm leading-none text-[#DDD7DD]">
							Officia pariatur minim sit tempor ex magna duis irure Lorem
							officia laborum. Commodo reprehenderit ex ullamco sint minim
							exercitation incididunt.
						</p>
						<p className="text-sm leading-none text-[#DDD7DD]">
							Ullamco culpa enim officia nulla occaecat veniam minim ad ad
							consequat. Magna adipisicing exercitation non est voluptate Lorem
							incididunt duis aute cupidatat. Adipisicing est elit ea commodo
							aliqua duis minim excepteur incididunt magna pariatur fugiat
							ullamco ut veniam. Irure laboris sit est laborum. Consectetur
							occaecat non fugiat ad non voluptate ex sunt elit dolore ipsum
							consequat.
						</p>
					</div>
				</div>
				<img src={childImage.src} alt="Child" className="w-full" />
			</div>
		),
	},
	{
		width: 500,
		backgroundClass: "bg-[#DDD7DD]",
		content: (
			<div className="flex h-full max-w-[500px] flex-col justify-end">
				<div className="space-y-4 p-6 pl-24">
					<p className="text-sm leading-none text-[#5A4A31]">
						Nostrud nulla proident exercitation ad ipsum ullamco eiusmod aliquip
						tempor pariatur id id. Excepteur tempor et ipsum culpa. Ipsum fugiat
						duis nostrud eu aliquip est eiusmod occaecat ad Lorem sit. Ipsum
						laboris sunt nostrud sit aliqua nulla et ex irure. Officia sint do
						adipisicing aliqua pariatur excepteur officia sunt fugiat. Enim
						tempor qui et enim exercitation deserunt nostrud cupidatat elit
						occaecat cillum irure proident.
					</p>
					<p className="text-sm leading-none text-[#5A4A31]">
						Pariatur id velit quis minim exercitation magna occaecat. Aliquip et
						do anim officia sit adipisicing consequat ut ex velit in est
						exercitation nulla. Ex ullamco ipsum occaecat aute laborum mollit
						voluptate consectetur sint elit amet est. Anim non consequat laboris
						voluptate voluptate aliqua sunt adipisicing incididunt.
					</p>
				</div>
				<div className="relative w-full">
					<img src={dishImage.src} alt="Dish" className="w-full" />
					<span className="font-tenor text-vertical absolute top-2 left-0 text-7xl text-[#DDD7DD]">
						Spicy
					</span>
					<span className="font-tenor text-vertical absolute -top-2 left-0 -translate-y-full text-7xl text-[#9F3725]">
						Signature
					</span>
				</div>
			</div>
		),
	},
	{
		width: 400,
		backgroundClass: "bg-[#2D2D22]",
		content: (
			<div className="flex h-full max-w-[400px] flex-col justify-between p-6">
				<img src={wokImage.src} alt="Wok" className="w-full" />
				<div className="space-y-4">
					<h2 className="font-hedvig text-4xl text-[#FDF9FD]">
						The Art of the Wok
					</h2>
					<p className="text-sm leading-none text-[#DDD7DD]">
						Veniam ullamco veniam ea in fugiat. Ad magna Lorem adipisicing irure
						ad. Ut mollit tempor excepteur anim id laboris ea voluptate proident
						non enim incididunt nostrud irure tempor. Ullamco ad aute irure sint
						proident labore sunt est.
					</p>
					<p className="text-sm leading-none text-[#DDD7DD]">
						Veniam ullamco veniam ea in fugiat. Ad magna Lorem adipisicing irure
						ad. Ut mollit tempor excepteur anim id laboris ea voluptate proident
						non enim incididunt nostrud irure tempor. Ullamco ad aute irure sint
						proident labore sunt est.
					</p>
				</div>
			</div>
		),
	},
];

const Stack = () => {
	const [activeIndex, setActiveIndex] = useState(-1);
	const [peekedIndex, setPeekedIndex] = useState<number | null>(null);
	const stackRef = useRef<HTMLDivElement>(null);
	const [containerRef, containerBounds] = useMeasure();

	const isMobile = containerBounds.width < 768;

	const peekHeight = 80; // Visible height of the next card at the bottom (px)

	// Compute base positions depending on orientation
	const baseStackPositions = useMemo(() => {
		if (isMobile) {
			const offscreenPos = containerBounds.height + 100; // ensure card fully out of view
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

	// Dynamic offsets for hover/peek (desktop only)
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
		<div ref={containerRef} className="h-full w-full">
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
								} // +2 because state changes first
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
