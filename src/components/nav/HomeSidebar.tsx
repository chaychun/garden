import { SlidingNumber } from "@/components/ui/sliding-number";
import { UnderlineLink } from "@/components/ui/underline-link";
import { filterCounts } from "@/lib/content-counts";
import { useFilterStore, type FilterType } from "@/lib/stores/filterStore";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Sidebar from "./Sidebar";

interface HomeSidebarProps {
	scrollAreaId?: string;
}

const filterOptions: FilterType[] = ["All", "Interactions", "Articles"];

export default function HomeSidebar({
	scrollAreaId = "main-scroll",
}: HomeSidebarProps) {
	const { activeFilter, setActiveFilter } = useFilterStore();

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
				<UnderlineLink
					href="/"
					className="text-base-500 hover:text-base-700 text-sm transition-colors duration-300"
				>
					About
				</UnderlineLink>
			</div>
			<div className="flex w-full items-center gap-4 p-4">
				<div className="text-base-300 flex w-[32px] flex-shrink-0 items-center font-mono text-sm">
					<span>(</span>
					<SlidingNumber value={filterCounts[activeFilter]} />
					<span>)</span>
				</div>
				<motion.ul
					className="flex w-[280px] flex-col gap-2"
					animate={{ y: getFilterListOffset() }}
					transition={{ type: "spring", duration: 0.5, bounce: 0 }}
				>
					{filterOptions.map((filter) => (
						<li key={filter}>
							<motion.button
								className={cn(
									"w-full bg-transparent text-left text-5xl transition-colors duration-300",
									activeFilter === filter
										? "text-base-900"
										: "text-base-200 hover:text-base-400",
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

	return (
		<Sidebar
			scrollAreaId={scrollAreaId}
			title={activeFilter}
			desktopContent={desktopContent}
			number={filterCounts[activeFilter]}
		/>
	);
}
