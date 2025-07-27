import { UnderlineLink } from "@/components/ui/underline-link";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "../lib/utils";
import MobileTopBar from "./MobileTopBar";

type FilterType = "All" | "Interactions" | "Articles";

const numberOfItems = {
	All: 35,
	Interactions: 24,
	Articles: 11,
};

export default function HomeMobileTopBar() {
	const [activeFilter, setActiveFilter] = useState<FilterType>("All");
	const { toggleMobileMenu } = useSidebarStore();

	const filterOptions: FilterType[] = ["All", "Interactions", "Articles"];

	const mobileContent = (
		<div className="h-full p-6">
			<ul className="flex w-[280px] flex-col gap-2">
				{filterOptions.map((filter) => (
					<li key={filter}>
						<motion.button
							className={cn(
								"flex w-full items-baseline gap-3 bg-transparent text-left text-5xl transition-colors duration-300",
								activeFilter === filter
									? "text-base-900"
									: "text-base-500 hover:text-base-700",
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
			<div className="mt-24 flex flex-col gap-3">
				<UnderlineLink
					href="/"
					className="text-base-500 hover:text-base-700 w-min text-5xl font-light transition-colors duration-300"
				>
					About
				</UnderlineLink>
			</div>
		</div>
	);

	return (
		<MobileTopBar
			title={activeFilter}
			number={numberOfItems[activeFilter]}
			mobileTitleLayoutId={`home-sidebar-title-${activeFilter}`}
			mobileNumberLayoutId={`home-sidebar-number-${activeFilter}`}
		>
			{mobileContent}
		</MobileTopBar>
	);
}
