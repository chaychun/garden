import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useState } from "react";
import rawItems from "./items.json";

type Item = { id: number; category: string };

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
	const closingIdRef = useRef<number | null>(null);

	return (
		<div className="relative h-full w-full bg-white">
			<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 p-6 text-center lg:hidden">
				<div className="max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow">
					<div className="mb-2 text-sm font-medium text-gray-900">
						Wider screen needed
					</div>
					<div className="text-sm text-gray-600">
						Switch to a wider screen to view this two-column layout.
					</div>
				</div>
			</div>

			<div className="hidden h-full w-full p-8 lg:grid lg:grid-cols-[1fr_360px] lg:gap-8">
				<div className="relative h-full overflow-auto rounded-xl border border-gray-200 p-6">
					<div className="grid grid-cols-3 gap-4">
						{items.map((item) => {
							const isActive =
								activeFilter === "all" || item.category === activeFilter;
							const isDimmed = selectedId !== null && item.id !== selectedId;
							const canExpand =
								activeFilter === "all" || item.category === activeFilter;

							const isClosing = closingIdRef.current === item.id;

							return (
								<motion.button
									key={item.id}
									onClick={() => canExpand && setSelectedId(item.id)}
									className="block w-full focus:outline-none"
									style={{ cursor: canExpand ? "pointer" : "default" }}
									aria-label={canExpand ? `View item ${item.id}` : undefined}
									disabled={!canExpand}
								>
									<motion.div
										layoutId={`item-${item.id}`}
										className={`aspect-[4/3] w-full rounded-lg ${categoryColor(item.category)}`}
										style={{
											position: "relative",
											zIndex: selectedId === item.id || isClosing ? 30 : 0,
										}}
										animate={{
											opacity: isActive ? (isDimmed ? 0 : 1) : 0.2,
										}}
										transition={{ duration: 0.25 }}
									/>
								</motion.button>
							);
						})}
					</div>
					<AnimatePresence
						mode="popLayout"
						onExitComplete={() => {
							closingIdRef.current = null;
						}}
					>
						{selectedId !== null && (
							<motion.div
								key="overlay"
								className="absolute inset-0 z-20 p-4"
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
												className={`h-full w-full rounded-xl ${categoryColor(current.category)}`}
											/>
										);
									})()}
								</motion.button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div className="h-full overflow-auto rounded-xl border border-gray-200 p-6">
					<div className="mb-4 text-sm font-medium text-gray-500">Filters</div>
					{selectedId !== null && (
						<div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
							{(() => {
								const current = items.find((i) => i.id === selectedId)!;
								return (
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-700">Selected</div>
										<div className="text-sm font-medium text-gray-900">
											#{current.id}
										</div>
										<div className="text-xs text-gray-500 capitalize">
											{current.category}
										</div>
									</div>
								);
							})()}
						</div>
					)}
					<div className="flex flex-col gap-2">
						{categories.map((c) => (
							<button
								key={c}
								onClick={() => setActiveFilter(c)}
								className={`flex items-center justify-between rounded-lg border px-4 py-2 text-sm capitalize transition-colors ${
									activeFilter === c
										? "border-gray-900 bg-gray-900 text-white"
										: "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
								}`}
							>
								<span>{c}</span>
								<span
									className={`ml-3 inline-block h-2 w-2 rounded-full ${c === "all" ? "bg-gray-300" : categoryColor(c)}`}
								/>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterLayoutTransition;
