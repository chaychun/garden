import { SlidingNumber } from "@/components/ui/sliding-number";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "../lib/utils";
import Sidebar from "./Sidebar";

interface HomeSidebarProps {
	scrollAreaId: string;
	title: string;
}

type FilterType = "All" | "Interactions" | "Articles";

const numberOfItems = {
	All: 35,
	Interactions: 24,
	Articles: 11,
};

export default function HomeSidebar({ scrollAreaId }: HomeSidebarProps) {
	const [activeFilter, setActiveFilter] = useState<FilterType>("All");
	const { toggleMobileMenu } = useSidebarStore();

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
			<div className="flex w-full items-center gap-4 p-4">
				<p className="text-base-300 flex w-[32px] flex-shrink-0 items-center font-mono text-sm">
					<span>(</span>
					<SlidingNumber value={numberOfItems[activeFilter]} />
					<span>)</span>
				</p>
				<motion.ul
					className="flex w-[280px] flex-col gap-2"
					animate={{ y: getFilterListOffset() }}
					transition={{ type: "spring", duration: 0.5, bounce: 0 }}
				>
					{filterOptions.map((filter) => (
						<li key={filter}>
							<motion.button
								className={cn(
									"w-full bg-transparent text-left text-5xl",
									activeFilter === filter ? "text-base-900" : "text-base-200",
								)}
								animate={{
									fontWeight: activeFilter === filter ? 700 : 300,
									fontSize: activeFilter === filter ? "60px" : "48px",
								}}
								transition={{ type: "spring", duration: 0.5, bounce: 0 }}
								type="button"
								onClick={() => setActiveFilter(filter)}
							>
								{filter}
							</motion.button>
						</li>
					))}
				</motion.ul>
			</div>
		</>
	);

	const mobileContent = (
		<div className="h-full p-6">
			<ul className="flex w-[280px] flex-col gap-2">
				{filterOptions.map((filter) => (
					<li key={filter}>
						<motion.button
							className={cn(
								"flex w-full items-baseline gap-3 bg-transparent text-left text-5xl",
								activeFilter === filter ? "text-base-900" : "text-base-500",
							)}
							animate={{
								fontWeight: activeFilter === filter ? 600 : 300,
							}}
							transition={{ type: "spring", duration: 0.5, bounce: 0 }}
							type="button"
							onClick={() => {
								setActiveFilter(filter);
								toggleMobileMenu();
							}}
						>
							<motion.span layoutId={`home-sidebar-title-${filter}`}>
								{filter}
							</motion.span>
							<motion.span
								className="text-base-500 font-mono text-sm font-normal"
								layoutId={`home-sidebar-number-${filter}`}
							>
								({numberOfItems[filter]})
							</motion.span>
						</motion.button>
					</li>
				))}
			</ul>
		</div>
	);

	return (
		<Sidebar
			scrollAreaId={scrollAreaId}
			title={activeFilter}
			desktopContent={desktopContent}
			mobileContent={mobileContent}
			number={numberOfItems[activeFilter]}
			mobileTitleLayoutId={`home-sidebar-title-${activeFilter}`}
			mobileNumberLayoutId={`home-sidebar-number-${activeFilter}`}
		/>
	);
}
