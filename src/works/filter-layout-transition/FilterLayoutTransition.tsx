import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useState } from "react";
import rawItems from "./items.json";

type Item = {
	id: number;
	category: string;
	title: string;
	aspectRatio: number;
};

const categories = ["all", "chairs", "sofas", "tables", "storage", "lighting"];

const items = rawItems as Item[];

function categoryColor(category: string) {
	if (category === "chairs") return "bg-emerald-400";
	if (category === "sofas") return "bg-sky-400";
	if (category === "tables") return "bg-amber-400";
	if (category === "storage") return "bg-fuchsia-400";
	if (category === "lighting") return "bg-lime-400";
	return "bg-gray-300";
}

const FilterLayoutTransition: React.FC = () => {
	const [activeFilter, setActiveFilter] = useState("all");
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [hoveredId, setHoveredId] = useState<number | null>(null);
	const closingIdRef = useRef<number | null>(null);
	const isFilterCollapseRef = useRef(false);
	const isAnimatingRef = useRef(false);

	const isItemInCurrentFilter = (item: Item) => {
		return activeFilter === "all" || item.category === activeFilter;
	};

	return (
		<div className="bg-base-50 relative h-full w-full">
			<div className="bg-base-50/90 absolute inset-0 z-10 flex items-center justify-center p-6 text-center @5xl:hidden">
				<div className="bg-base-50 max-w-sm p-6 shadow">
					<div className="text-base-900 mb-2 text-sm font-medium">
						Wider screen needed
					</div>
					<div className="text-base-600 text-sm">
						Switch to a wider screen to view this two-column layout.
					</div>
				</div>
			</div>

			<div className="hidden h-full w-full @5xl:grid @5xl:grid-cols-[3fr_2fr]">
				<div className="bg-base-50 relative h-full overflow-hidden p-4">
					<div className="flex h-full max-w-[674px] flex-col gap-4">
						{Array.from({ length: 4 }, (_, rowIndex) => (
							<div key={rowIndex} className="flex items-start gap-4">
								{items.slice(rowIndex * 4, (rowIndex + 1) * 4).map((item) => {
									const isDimmed =
										selectedId !== null && item.id !== selectedId;
									const isItemInFilter = isItemInCurrentFilter(item);
									const isHovered = hoveredId === item.id;
									const isClosing = closingIdRef.current === item.id;

									return (
										<motion.button
											key={item.id}
											onClick={() => isItemInFilter && setSelectedId(item.id)}
											onMouseEnter={() =>
												isItemInFilter &&
												!isAnimatingRef.current &&
												setHoveredId(item.id)
											}
											onMouseLeave={() =>
												!isAnimatingRef.current && setHoveredId(null)
											}
											className="relative flex-1 focus:outline-none"
											style={{
												cursor: isItemInFilter ? "pointer" : "default",
												aspectRatio: item.aspectRatio,
												flex: isHovered ? "3" : "2",
												height: "auto",
											}}
											aria-label={
												isItemInFilter ? `View item ${item.id}` : undefined
											}
											disabled={!isItemInFilter}
											layout
											onLayoutAnimationStart={() => {
												isAnimatingRef.current = true;
												setHoveredId(null);
											}}
											onLayoutAnimationComplete={() => {
												isAnimatingRef.current = false;
											}}
										>
											<motion.div
												layoutId={`item-${item.id}`}
												className={`absolute inset-0 ${categoryColor(item.category)}`}
												style={{
													zIndex: selectedId === item.id || isClosing ? 30 : 0,
												}}
												animate={
													isClosing && !isFilterCollapseRef.current
														? {}
														: {
																opacity: isItemInFilter
																	? isDimmed
																		? 0
																		: 1
																	: 0.2,
															}
												}
												transition={{
													opacity: isClosing
														? {
																duration: isFilterCollapseRef.current ? 0.3 : 0,
															}
														: undefined,
												}}
												onLayoutAnimationStart={() => {
													isAnimatingRef.current = true;
													setHoveredId(null);
												}}
												onLayoutAnimationComplete={() => {
													isAnimatingRef.current = false;
												}}
											/>
										</motion.button>
									);
								})}
							</div>
						))}
					</div>
					<AnimatePresence
						mode="popLayout"
						onExitComplete={() => {
							closingIdRef.current = null;
							isFilterCollapseRef.current = false;
						}}
					>
						{selectedId !== null && (
							<motion.div
								key="overlay"
								className="absolute inset-0 z-10 p-4"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<motion.button
									onClick={() => {
										if (selectedId !== null) closingIdRef.current = selectedId;
										setSelectedId(null);
									}}
									className="block h-full w-full cursor-pointer focus:outline-none"
									aria-label="Close expanded view"
								>
									{(() => {
										const current = items.find((i) => i.id === selectedId)!;
										return (
											<motion.div
												layoutId={`item-${selectedId}`}
												className={`h-full w-full ${categoryColor(current.category)}`}
												onLayoutAnimationStart={() => {
													isAnimatingRef.current = true;
													setHoveredId(null);
												}}
												onLayoutAnimationComplete={() => {
													isAnimatingRef.current = false;
												}}
											/>
										);
									})()}
								</motion.button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div className="bg-base-50 flex h-full flex-col p-4">
					<div className="mt-auto flex flex-col gap-2">
						<AnimatePresence>
							{selectedId !== null && (
								<div className="bg-base-50">
									{(() => {
										const current = items.find((i) => i.id === selectedId)!;
										return (
											<motion.div
												initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
												animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
												exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
												transition={{
													type: "spring",
													duration: 0.4,
													bounce: 0,
												}}
												className="text-base-900 font-gambarino text-4xl leading-tight"
											>
												{current.title}
											</motion.div>
										);
									})()}
								</div>
							)}
						</AnimatePresence>
						<div className="mt-4 flex flex-row gap-2">
							{categories.map((c) => (
								<button
									key={c}
									onClick={() => {
										if (selectedId !== null) {
											isFilterCollapseRef.current = true;
											closingIdRef.current = selectedId;
											setSelectedId(null);
										}
										setActiveFilter(c);
									}}
									className={`px-3 py-1.5 text-xs whitespace-nowrap capitalize transition-colors ${
										activeFilter === c
											? "bg-base-900 text-base-50"
											: "bg-base-50 text-base-700 hover:bg-base-100"
									}`}
								>
									{c}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterLayoutTransition;
