import { AnimatePresence, motion } from "motion/react";
import React, { useRef, useState } from "react";
import rawItems from "./items.json";

type Item = { id: number; category: string; aspectRatio: number };

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
					<div
						className="grid h-full max-h-full place-items-start content-start gap-4"
						style={{
							gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
						}}
					>
						{items.map((item) => {
							const isActive =
								activeFilter === "all" || item.category === activeFilter;
							const isDimmed = selectedId !== null && item.id !== selectedId;
							const canExpand =
								activeFilter === "all" || item.category === activeFilter;

							const isClosing = closingIdRef.current === item.id;

							return (
								<div className="w-full">
									<motion.button
										key={item.id}
										onClick={() => canExpand && setSelectedId(item.id)}
										className="relative block w-full focus:outline-none"
										style={{
											cursor: canExpand ? "pointer" : "default",
											paddingBottom: `${(1 / item.aspectRatio) * 100}%`,
											width: "100%",
										}}
										aria-label={canExpand ? `View item ${item.id}` : undefined}
										disabled={!canExpand}
									>
										<motion.div
											layoutId={`item-${item.id}`}
											className={`absolute inset-0 ${categoryColor(item.category)}`}
											style={{
												zIndex: selectedId === item.id || isClosing ? 30 : 0,
											}}
											animate={{
												opacity: isActive ? (isDimmed ? 0 : 1) : 0.2,
											}}
											transition={{ duration: 0.25 }}
										/>
									</motion.button>
								</div>
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
											/>
										);
									})()}
								</motion.button>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div className="bg-base-50 flex h-full flex-col p-4">
					{selectedId !== null && (
						<div className="bg-base-50 mb-4 p-4">
							{(() => {
								const current = items.find((i) => i.id === selectedId)!;
								return (
									<div className="flex items-center justify-between">
										<div className="text-base-700 text-sm">Selected</div>
										<div className="text-base-900 text-sm font-medium">
											#{current.id}
										</div>
										<div className="text-base-500 text-xs capitalize">
											{current.category}
										</div>
									</div>
								);
							})()}
						</div>
					)}
					<div className="mt-auto">
						<div className="flex flex-row gap-2">
							{categories.map((c) => (
								<button
									key={c}
									onClick={() => setActiveFilter(c)}
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
