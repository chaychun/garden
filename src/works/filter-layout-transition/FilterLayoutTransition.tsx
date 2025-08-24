import { FilterButton } from "@/components/ui/filter-button";
import { getCldImageUrl } from "astro-cloudinary/helpers";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import React, { useRef, useState } from "react";
import rawItems from "./items.json";

type Item = {
	id: string;
	category: string;
	title: string;
};

const categories = ["all", "chairs", "sofas", "tables", "storage", "lighting"];

const items: Item[] = rawItems;

const FilterLayoutTransition: React.FC = () => {
	const [activeFilter, setActiveFilter] = useState("all");
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const closingIdRef = useRef<string | null>(null);
	const isFilterCollapseRef = useRef(false);

	const isItemInCurrentFilter = (item: Item) => {
		return activeFilter === "all" || item.category === activeFilter;
	};

	return (
		<MotionConfig
			transition={{
				type: "spring",
				duration: 0.6,
				bounce: 0,
			}}
		>
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
								<div
									key={rowIndex}
									className="relative flex items-start gap-4"
									style={{
										zIndex: items
											.slice(rowIndex * 4, (rowIndex + 1) * 4)
											.some(
												(i) =>
													i.id === selectedId || closingIdRef.current === i.id,
											)
											? 4
											: 0,
									}}
								>
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
													selectedId === null &&
													closingIdRef.current === null &&
													setHoveredId(item.id)
												}
												onMouseLeave={() => {
													if (closingIdRef.current !== null) return;
													setHoveredId(null);
												}}
												className="relative flex-1 focus:outline-none"
												style={{
													cursor: isItemInFilter ? "pointer" : "default",
													flex: isHovered ? "3" : "2",
													zIndex: selectedId === item.id || isClosing ? 5 : 0,
												}}
												aria-label={
													isItemInFilter ? `View item ${item.id}` : undefined
												}
												disabled={!isItemInFilter}
												layout
											>
												<motion.img
													layoutId={`item-${item.id}`}
													src={getCldImageUrl({ src: item.id })}
													alt={item.title}
													className="block h-auto w-full"
													style={{
														zIndex:
															selectedId === item.id || isClosing ? 30 : 0,
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
								>
									<motion.button
										onClick={() => {
											if (selectedId !== null)
												closingIdRef.current = selectedId;
											setHoveredId(null);
											setSelectedId(null);
										}}
										className="block h-full w-full cursor-pointer focus:outline-none"
										aria-label="Close expanded view"
									>
										{(() => {
											const current = items.find((i) => i.id === selectedId)!;
											return (
												<motion.img
													layoutId={`item-${selectedId}`}
													src={getCldImageUrl({ src: current.id })}
													alt={current.title}
													className="h-full w-full object-cover"
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
									<FilterButton
										key={c}
										active={activeFilter === c}
										onClick={() => {
											if (selectedId !== null) {
												isFilterCollapseRef.current = true;
												closingIdRef.current = selectedId;
												setSelectedId(null);
											}
											setActiveFilter(c);
										}}
										className="text-xs capitalize"
										ariaLabel={`Filter ${c}`}
									>
										{c}
									</FilterButton>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</MotionConfig>
	);
};

export default FilterLayoutTransition;
