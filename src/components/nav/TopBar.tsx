import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import type { FilterType } from "@/lib/stores/filterStore";
import { useFilterStore } from "@/lib/stores/filterStore";
import { ChevronRight } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AnimatedMenuIcon } from "../ui/animated-menu-icon";

interface TopBarProps {
	title?: string;
}

export default function TopBar({ title = "Chayut" }: TopBarProps) {
	const scrollTargetRef = useRef<HTMLElement | Window | null>(null);
	const cleanupRef = useRef<(() => void) | null>(null);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const rafIdRef = useRef<number | null>(null);
	const { activeFilter, setActiveFilter } = useFilterStore();
	const availableFilters: FilterType[] = ["All", "Interactions", "Articles"];

	const isSingleRow = isDesktop || (!isDesktop && isScrolled);
	const HEADER_HEIGHT_SINGLE_ROW = 80;
	const HEADER_HEIGHT_DOUBLE_ROW = 135;
	const MENU_EXTRA_HEIGHT = 200;
	const baseHeight = isSingleRow
		? HEADER_HEIGHT_SINGLE_ROW
		: HEADER_HEIGHT_DOUBLE_ROW;
	const targetHeight = isFilterOpen
		? baseHeight + MENU_EXTRA_HEIGHT
		: baseHeight;

	useEffect(() => {
		function detach() {
			if (cleanupRef.current) {
				cleanupRef.current();
				cleanupRef.current = null;
			}
		}

		function attach() {
			detach();

			const desktop = window.innerWidth >= 768;
			setIsDesktop(desktop);

			const container = desktop
				? (document.querySelector("#scroll-container") as HTMLElement | null)
				: null;

			const target: HTMLElement | Window = container ?? window;
			scrollTargetRef.current = target;

			const readPosition = () => {
				if (rafIdRef.current !== null) return;
				rafIdRef.current = requestAnimationFrame(() => {
					let scrolled = false;
					if (target instanceof Window) {
						scrolled =
							(window.pageYOffset || document.documentElement.scrollTop) > 0;
					} else {
						scrolled = target.scrollLeft > 0 || target.scrollTop > 0;
					}
					setIsScrolled(scrolled);
					rafIdRef.current = null;
				});
			};

			const onScroll = () => readPosition();
			target.addEventListener("scroll", onScroll, { passive: true });
			readPosition();

			const onResize = () => attach();
			window.addEventListener("resize", onResize, { passive: true });

			cleanupRef.current = () => {
				if (rafIdRef.current !== null) {
					cancelAnimationFrame(rafIdRef.current);
					rafIdRef.current = null;
				}
				if (target) {
					target.removeEventListener("scroll", onScroll as EventListener);
				}
				window.removeEventListener("resize", onResize);
			};
		}

		const init = () => attach();

		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", init, { once: true });
		} else {
			init();
		}

		document.addEventListener("astro:page-load", init);

		return () => {
			document.removeEventListener("astro:page-load", init);
			document.removeEventListener("DOMContentLoaded", init);
			detach();
		};
	}, []);

	return (
		<div className="fixed top-0 right-0 left-0 z-40">
			<motion.div
				initial={false}
				animate={{ height: targetHeight }}
				className="from-base-50 via-base-50/70 pointer-events-none absolute top-0 right-0 left-0 z-0 bg-gradient-to-b to-transparent"
			>
				<ProgressiveBlur
					className="absolute inset-0"
					direction="top"
					blurLayers={8}
					blurIntensity={3}
				/>
			</motion.div>
			<MotionConfig transition={{ type: "spring", duration: 0.6, bounce: 0 }}>
				<motion.div
					layout={!isDesktop}
					className={
						"relative z-10 grid grid-cols-4 p-2 md:grid-cols-6 lg:grid-cols-5 " +
						(!isDesktop && isScrolled
							? "grid-rows-1 items-center"
							: "grid-rows-2 items-end md:grid-rows-1")
					}
				>
					<motion.h1
						layout={!isDesktop}
						initial={false}
						animate={
							!isDesktop && isScrolled
								? { y: -40, opacity: 0 }
								: { y: 0, opacity: 1 }
						}
						className="text-base-900 col-span-2 col-start-1 text-5xl font-semibold tracking-tight md:col-span-1"
						style={{ gridRowStart: 1 }}
					>
						{title}
					</motion.h1>

					<motion.div
						layout={!isDesktop}
						initial={false}
						className={
							"text-base-700 col-start-1 text-3xl font-medium tracking-tight md:col-start-3 md:row-start-1 md:mr-6 md:justify-self-end md:text-4xl " +
							(isScrolled && !isDesktop ? "row-start-1" : "row-start-2")
						}
					>
						(42)
					</motion.div>

					<motion.div
						layout={!isDesktop}
						initial={false}
						className={
							"relative col-span-3 col-start-2 md:col-span-3 md:col-start-4 md:row-start-1 " +
							(isScrolled && !isDesktop ? "row-start-1" : "row-start-2")
						}
					>
						<button
							type="button"
							onClick={() => setIsFilterOpen((prev) => !prev)}
							className="text-base-900 flex cursor-pointer items-end gap-1 md:gap-2"
							aria-haspopup="menu"
							aria-expanded={isFilterOpen}
						>
							<span className="text-4xl font-medium tracking-tight md:text-5xl">
								{activeFilter}
							</span>
							<ChevronRight
								className={
									"h-8 w-8 transition-transform duration-200 md:h-9 md:w-9 md:stroke-3 " +
									(isFilterOpen ? "rotate-90" : "rotate-0")
								}
							/>
						</button>
						{isFilterOpen ? (
							<div role="menu" className="absolute top-full left-0">
								{availableFilters
									.filter((option) => option !== activeFilter)
									.map((filterOption) => (
										<button
											key={filterOption}
											type="button"
											onClick={() => {
												setActiveFilter(filterOption);
												setIsFilterOpen(false);
											}}
											className="block cursor-pointer text-left"
											role="menuitem"
										>
											<span className="text-base-500 hover:text-base-900 flex items-end gap-1 transition-colors duration-300 md:gap-2">
												<span className="text-4xl font-medium tracking-tight md:text-5xl">
													{filterOption}
												</span>
											</span>
										</button>
									))}
							</div>
						) : null}
					</motion.div>
				</motion.div>
			</MotionConfig>

			<button
				className="border-base-300/30 bg-base-50/50 text-base-500 hover:bg-base-300/30 hover:text-base-700 absolute top-[14px] right-2 z-20 flex h-9 w-fit items-center justify-center border px-3 py-1 backdrop-blur-sm transition-colors duration-300 hover:border-transparent"
				aria-label="Open menu"
			>
				<AnimatedMenuIcon isOpen={false} className="stroke-1" />
			</button>
		</div>
	);
}
