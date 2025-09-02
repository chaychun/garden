import {
	BlurDialog,
	BlurDialogContent,
	BlurDialogTrigger,
	BlurDialogVariants,
} from "@/components/ui/blur-dialog";
import { AVAILABLE_FILTERS, type FilterType } from "@/lib/content-types";
import { useFilterStore } from "@/lib/stores/filterStore";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { UnderlineLink } from "../ui/underline-link";

interface HeaderProps {
	title: string;
	filterCounts: Record<FilterType, number>;
}

export default function Header({ title, filterCounts }: HeaderProps) {
	const { activeFilter, setActiveFilter } = useFilterStore();

	const handleFilterClick = (filter: FilterType) => {
		setActiveFilter(filter);
	};

	const infoButton = useMemo(
		() => (
			<BlurDialog>
				<BlurDialogTrigger>
					<button className="text-base-300 hover:text-base-600 inline-flex items-center gap-1 text-xs leading-[1.1] font-semibold uppercase transition-colors">
						<span>More info</span>
						<ArrowDown className="h-3 w-3" strokeWidth={2.5} />
					</button>
				</BlurDialogTrigger>
				<BlurDialogContent overlayZIndex={10}>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="flex flex-col gap-3">
							<motion.div
								variants={BlurDialogVariants.block}
								className="text-base-900 text-xs font-semibold uppercase"
							>
								About
							</motion.div>
							<motion.p
								variants={BlurDialogVariants.block}
								className="text-base-700 text-xs leading-[1.35]"
							>
								This site is a curated collection of my experiments in web
								design and interaction. I build things I find interesting to
								learn about how they work. Many of them are inspired by other
								works on the web, or my attempt at recreating them one-to-one.
								I've made sure to credit the original source when I can.
							</motion.p>
							<motion.p
								variants={BlurDialogVariants.block}
								className="text-base-700 text-xs leading-[1.35]"
							>
								I build mainly with Astro and React. I also quite like motion
								design, if you can't tell. Other than that, I also like writing
								notes, reading psychology, and doing recreational mathematics.
							</motion.p>
						</div>
						<div className="flex flex-col gap-3">
							<motion.div
								variants={BlurDialogVariants.block}
								className="text-base-900 text-xs font-semibold uppercase"
							>
								Find me
							</motion.div>
							<motion.ul
								variants={BlurDialogVariants.block}
								className="text-base-700 flex gap-2 text-xs"
							>
								<li>
									<UnderlineLink href="mailto:chun.chayut@gmail.com">
										Email
									</UnderlineLink>
								</li>
								<li>
									<UnderlineLink
										href="https://github.com/chaychun"
										target="_blank"
									>
										GitHub
									</UnderlineLink>
								</li>
								<li>
									<UnderlineLink
										href="https://x.com/ChunChayut"
										target="_blank"
									>
										Twitter
									</UnderlineLink>
								</li>
							</motion.ul>
						</div>
					</div>
				</BlurDialogContent>
			</BlurDialog>
		),
		[],
	);

	const getFilterCount = (filter: FilterType): number =>
		filterCounts[filter] ?? 0;

	return (
		<header className="relative z-50 p-4">
			<div className="relative z-50">
				<div className="border-base-100 bg-base-50 fixed top-0 right-0 left-0 z-40 border-b md:hidden">
					<div className="mx-auto px-4 py-3">
						<div className="flex justify-between">
							{AVAILABLE_FILTERS.map((filter) => (
								<button
									key={filter}
									onClick={() => handleFilterClick(filter)}
									className={cn(
										"flex items-center gap-1 text-xs leading-[1.1] font-semibold uppercase transition-colors duration-200",
										activeFilter === filter
											? "text-base-900"
											: "text-base-300 hover:text-base-600",
									)}
								>
									<span>{filter.toLowerCase()}</span>
								</button>
							))}
						</div>
					</div>
				</div>
				<div className="h-14 md:hidden" />
				<div className="hidden grid-cols-5 items-start gap-2.5 md:grid">
					<div className="text-base-900 text-xl font-medium">{title}.</div>

					<div className="flex gap-2.5">
						<div className="flex flex-col">
							{AVAILABLE_FILTERS.map((filter) => (
								<button
									key={filter}
									onClick={() => handleFilterClick(filter)}
									className={cn(
										"relative text-left text-xs leading-[1.1] font-semibold uppercase transition-colors duration-200",
										activeFilter === filter
											? "text-base-900"
											: "text-base-300 hover:text-base-700",
									)}
								>
									{activeFilter === filter && (
										<span className="text-base-900 absolute -left-6 text-xs leading-[1.1] font-semibold">
											({getFilterCount(filter)})
										</span>
									)}
									<span className="flex items-center">
										{filter.toLowerCase()}
									</span>
								</button>
							))}
						</div>
					</div>

					<div className="col-span-2 flex flex-col gap-1">
						<div className="text-base-900 text-xs leading-[1.1] font-semibold uppercase">
							Self-taught designer-builder exploring interesting patterns on the
							web.
						</div>

						{infoButton}
					</div>

					<a
						href="mailto:chun.chayut@gmail.com"
						className="text-base-900 hover:text-base-600 cursor-pointer text-right text-xs leading-[1.1] font-semibold uppercase transition-colors"
					>
						Contact
					</a>
				</div>

				<div className="flex flex-col gap-4 md:hidden">
					<div className="grid grid-cols-5 items-start gap-2.5">
						<div className="text-base-900 col-span-2 text-xl font-medium">
							{title}.
						</div>

						<div className="col-span-3 flex flex-col gap-1">
							<div className="text-base-900 text-xs leading-[1.1] font-semibold uppercase">
								Self-taught designer-builder exploring interesting patterns on
								the web.
							</div>

							{infoButton}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
