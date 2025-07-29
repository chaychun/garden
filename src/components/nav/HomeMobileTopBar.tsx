import { UnderlineLink } from "@/components/ui/underline-link";
import { useFilterStore, type FilterType } from "@/lib/stores/filterStore";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import MobileTopBar from "./MobileTopBar";

const filterOptions: FilterType[] = ["All", "Interactions", "Articles"];

export default function HomeMobileTopBar() {
	const { activeFilter, setActiveFilter, getFilterCount } = useFilterStore();
	const { toggleMobileMenu } = useSidebarStore();

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
								({getFilterCount(filter)})
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
			number={getFilterCount(activeFilter)}
			mobileTitleLayoutId={`home-sidebar-title-${activeFilter}`}
			mobileNumberLayoutId={`home-sidebar-number-${activeFilter}`}
		>
			{mobileContent}
		</MobileTopBar>
	);
}
