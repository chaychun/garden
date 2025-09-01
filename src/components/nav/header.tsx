import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { AVAILABLE_FILTERS, type FilterType } from "@/lib/content-types";
import { useFilterStore } from "@/lib/stores/filterStore";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { easeOut } from "motion";
import { AnimatePresence, motion, stagger } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { UnderlineLink } from "../ui/underline-link";

const infoVariants = {
	container: {
		hidden: {
			transition: {
				duration: 0.3,
				delayChildren: stagger(0.05, {
					from: "last",
				}),
				ease: easeOut,
			},
		},
		visible: {
			transition: {
				duration: 0.3,
				delayChildren: stagger(0.05),
				ease: easeOut,
			},
		},
	},
	block: {
		hidden: {
			opacity: 0,
			y: 8,
			filter: "blur(8px)",
		},
		visible: {
			opacity: 1,
			y: 0,
			filter: "blur(0px)",
			transition: {
				duration: 0.2,
				ease: easeOut,
			},
		},
	},
};

interface HeaderProps {
	title: string;
	filterCounts: Record<FilterType, number>;
}

export default function Header({ title, filterCounts }: HeaderProps) {
	const { activeFilter, setActiveFilter } = useFilterStore();
	const [isInfoOpen, setIsInfoOpen] = useState(false);

	const handleFilterClick = (filter: FilterType) => {
		setActiveFilter(filter);
	};

	const infoButton = useMemo(
		() => (
			<div className="relative mt-2 flex items-center gap-1">
				<button
					onClick={() => setIsInfoOpen((v) => !v)}
					className="text-base-300 hover:text-base-600 inline-flex items-center gap-1 text-xs leading-[1.1] font-semibold uppercase transition-colors"
				>
					<span>{isInfoOpen ? "Less info" : "More info"}</span>
					{isInfoOpen ? (
						<ArrowUp className="h-3 w-3" strokeWidth={2.5} />
					) : (
						<ArrowDown className="h-3 w-3" strokeWidth={2.5} />
					)}
				</button>
				<AnimatePresence>
					{isInfoOpen && (
						<motion.div
							className="absolute top-full right-0 left-0 z-50 mt-6 max-w-[min(92vw,720px)] md:-right-full"
							initial="hidden"
							animate="visible"
							exit="hidden"
							variants={infoVariants.container}
						>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="flex flex-col gap-3">
									<motion.div
										variants={infoVariants.block}
										className="text-base-900 text-xs font-semibold uppercase"
									>
										About
									</motion.div>
									<motion.p
										variants={infoVariants.block}
										className="text-base-700 text-xs leading-[1.35]"
									>
										This site is a curated collection of my experiments in web
										design and interaction. I build things I find interesting to
										learn about how they work. Many of them are inspired by
										other works on the web, or my attempt at recreating them
										one-to-one. I've made sure to credit the original source
										when I can.
									</motion.p>
									<motion.p
										variants={infoVariants.block}
										className="text-base-700 text-xs leading-[1.35]"
									>
										I build mainly with Astro and React. I also quite like
										motion design, if you can't tell. Other than that, I also
										like writing notes, reading psychology, and doing
										recreational mathematics.
									</motion.p>
								</div>
								<div className="flex flex-col gap-3">
									<motion.div
										variants={infoVariants.block}
										className="text-base-900 text-xs font-semibold uppercase"
									>
										Find me
									</motion.div>
									<motion.ul
										variants={infoVariants.block}
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
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		),
		[isInfoOpen],
	);

	const getFilterCount = (filter: FilterType): number => {
		if (filter === "All") {
			return filterCounts["All"] ?? 0;
		}
		return filterCounts[filter] ?? 0;
	};

	const isMobile = () => window.innerWidth < 768;

	useEffect(() => {
		if (isMobile() && isInfoOpen) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			document.documentElement.classList.add("mobile-menu-open");
		} else {
			document.documentElement.classList.remove("mobile-menu-open");
		}

		return () => {
			document.documentElement.classList.remove("mobile-menu-open");
		};
	}, [isInfoOpen]);

	return (
		<header className="relative z-50 p-4">
			<AnimatePresence>
				{isInfoOpen && (
					<div
						className="fixed inset-x-0 top-0 z-30"
						onClick={() => setIsInfoOpen(false)}
					>
						<motion.div
							className="fixed inset-0"
							style={{
								background:
									"linear-gradient(to bottom, rgba(248, 248, 247, 0.7) 0%, rgba(248, 248, 247, 0.6) 20%, rgba(248, 248, 247, 0.1) 70%, transparent 100%)",
								transformOrigin: "top center",
							}}
							initial={{ scale: 1, opacity: 0 }}
							animate={{ scale: 3, opacity: 1 }}
							exit={{
								scale: 1,
								opacity: 0,
								transition: { ease: "easeIn", duration: 0.3 },
							}}
							transition={{
								duration: 0.4,
								ease: easeOut,
							}}
						/>

						<ProgressiveBlur
							direction="top"
							blurLayers={10}
							blurIntensity={5}
							className="absolute inset-x-0 top-0 h-[120dvh]"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{
								opacity: 0,
								transition: { ease: "easeIn", duration: 0.3 },
							}}
							transition={{
								duration: 0.4,
								ease: easeOut,
							}}
						/>
					</div>
				)}
			</AnimatePresence>
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
				{/* Desktop Layout */}
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

					{/* Description Section (spans 2 columns) */}
					<div className="col-span-2 flex flex-col gap-1">
						<div className="text-base-900 text-xs leading-[1.1] font-semibold uppercase">
							Self-taught designer-builder exploring interesting patterns on the
							web.
						</div>

						{infoButton}
					</div>

					{/* Contact */}
					<a
						href="mailto:chun.chayut@gmail.com"
						className="text-base-900 hover:text-base-600 cursor-pointer text-right text-xs leading-[1.1] font-semibold uppercase transition-colors"
					>
						Contact
					</a>
				</div>

				{/* Mobile Layout */}
				<div className="flex flex-col gap-4 md:hidden">
					<div className="grid grid-cols-5 items-start gap-2.5">
						<div className="text-base-900 col-span-2 text-xl font-medium">
							{title}.
						</div>

						{/* Description Section (spans 3 columns) */}
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
