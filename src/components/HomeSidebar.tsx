import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "../lib/utils";
import Sidebar from "./Sidebar";

interface HomeSidebarProps {
	scrollAreaId: string;
	title: string;
}

type FilterType = "All" | "Interactions" | "Articles";

export default function HomeSidebar({ scrollAreaId, title }: HomeSidebarProps) {
	const [activeFilter, setActiveFilter] = useState<FilterType>("All");

	const filterOptions: FilterType[] = ["All", "Interactions", "Articles"];

	const getFilterListOffset = () => {
		const activeIndex = filterOptions.indexOf(activeFilter);
		const itemHeight = 48; // 5xl
		const gap = 8;
		const totalItemHeight = itemHeight + gap;
		const middleIndex = Math.floor(filterOptions.length / 2);
		return (middleIndex - activeIndex) * totalItemHeight;
	};

	const desktopContent = (
		<>
			<div className="flex w-full items-center justify-between p-4">
				<a href="/" className="text-base-900 text-lg font-semibold">
					Chayut
				</a>
				<a
					href="/"
					className="text-base-500 text-sm underline hover:opacity-75"
				>
					About
				</a>
			</div>
			<div className="flex items-center gap-4 p-4">
				<p className="text-base-300 font-mono text-xs">Filter by Type</p>
				<motion.ul
					className="flex flex-col gap-2"
					animate={{ y: getFilterListOffset() }}
					transition={{ type: "spring", duration: 0.5, bounce: 0 }}
				>
					{filterOptions.map((filter) => (
						<li key={filter}>
							<button
								className={cn(
									"bg-transparent text-5xl font-semibold",
									activeFilter === filter ? "text-base-900" : "text-base-200",
								)}
								type="button"
								onClick={() => setActiveFilter(filter)}
							>
								{filter}
							</button>
						</li>
					))}
				</motion.ul>
			</div>
		</>
	);

	const mobileContent = (
		<div className="h-full p-6 text-white">
			<div className="mb-4 text-lg font-bold">Sidebar</div>
			<div className="mb-4 text-sm">Mobile menu content goes here</div>
			<div className="mb-4 text-sm">This is the expanded mobile sidebar</div>
		</div>
	);

	return (
		<Sidebar
			scrollAreaId={scrollAreaId}
			title={activeFilter}
			desktopContent={desktopContent}
			mobileContent={mobileContent}
		/>
	);
}
