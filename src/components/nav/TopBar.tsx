import { ProgressiveBlur } from "@/components/ui/progressive-blur";
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
	const rafIdRef = useRef<number | null>(null);

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
			<ProgressiveBlur
				className="from-base-50 via-base-50/70 absolute top-0 right-0 left-0 z-0 h-[120%] bg-gradient-to-b to-transparent"
				direction="top"
				blurLayers={8}
				blurIntensity={3}
			/>
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
						<div className="text-base-900 flex items-end gap-1 md:gap-2">
							<div className="text-4xl font-medium tracking-tight md:text-5xl">
								Interactions
							</div>
							<ChevronRight className="h-8 w-8 md:h-9 md:w-9 md:stroke-3" />
						</div>
						<div className="absolute bottom-0 left-0 hidden translate-y-full">
							Articles
						</div>
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
