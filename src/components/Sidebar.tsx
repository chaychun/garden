import { AnimatedMenuIcon } from "@/components/ui/animated-menu-icon";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { SlidingNumber } from "@/components/ui/sliding-number";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
	scrollAreaId: string;
	title: string;
	desktopContent: React.ReactNode;
	mobileContent: React.ReactNode;
	number?: number;
	mobileTitleLayoutId?: string;
	mobileNumberLayoutId?: string;
}

export default function Sidebar({
	scrollAreaId,
	title,
	desktopContent,
	mobileContent,
	number,
	mobileTitleLayoutId,
	mobileNumberLayoutId,
}: SidebarProps) {
	const {
		isExpanded,
		isMobileMenuOpen,
		isManualToggle,
		toggleMobileMenu,
		setExpanded,
		setManualToggle,
	} = useSidebarStore();

	const [isMobile, setIsMobile] = useState(false);
	const scrollContainerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		const findScrollContainer = () => {
			const scrollArea = document.querySelector(
				`[data-scroll-area-id="${scrollAreaId}"]`,
			);
			if (scrollArea) {
				const viewport = scrollArea.querySelector(".scroll-area-viewport");
				if (viewport) {
					scrollContainerRef.current = viewport as HTMLElement;
				}
			}
		};

		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", findScrollContainer);
		} else {
			findScrollContainer();
		}

		return () => {
			document.removeEventListener("DOMContentLoaded", findScrollContainer);
		};
	}, [scrollAreaId]);

	useEffect(() => {
		if (isMobile || !scrollContainerRef.current) return;

		const handleScroll = () => {
			if (isManualToggle) return;

			const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

			if (scrollLeft > 0 && isExpanded) {
				setExpanded(false);
			}
		};

		const handleWheel = (e: WheelEvent) => {
			if (isManualToggle) return;

			const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

			if (scrollLeft === 0 && e.deltaX < 0 && !isExpanded) {
				setExpanded(true);
			}

			if (scrollLeft === 0 && !e.shiftKey && e.deltaY < 0 && !isExpanded) {
				setExpanded(true);
			}
		};

		const scrollContainer = scrollContainerRef.current;
		scrollContainer.addEventListener("scroll", handleScroll);
		scrollContainer.addEventListener("wheel", handleWheel);

		return () => {
			scrollContainer.removeEventListener("scroll", handleScroll);
			scrollContainer.removeEventListener("wheel", handleWheel);
		};
	}, [isExpanded, isMobile, isManualToggle, setExpanded]);

	const handleToggleSidebar = () => {
		setManualToggle(true);

		if (!isExpanded) {
			const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

			if (scrollLeft !== 0) {
				scrollContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
			}
			setExpanded(true);
		} else {
			setExpanded(false);
		}

		setTimeout(() => {
			setManualToggle(false);
		}, 600);
	};

	const defaultTransition = {
		type: "spring" as const,
		duration: 0.8,
		bounce: 0,
	};

	if (isMobile) {
		return (
			<>
				<div className="relative z-50 mx-auto flex w-full max-w-[528px] items-center justify-between px-6 py-4">
					<div className="flex items-baseline gap-2">
						<AnimatePresence mode="popLayout">
							{isMobileMenuOpen ? (
								<motion.h1
									key="mobile-title-open"
									className="text-base-900 text-2xl font-semibold"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									Chayut
								</motion.h1>
							) : (
								<motion.h1
									key="mobile-title-closed"
									className="text-base-900 text-2xl font-semibold"
									layoutId={mobileTitleLayoutId}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									{title}
								</motion.h1>
							)}

							{!isMobileMenuOpen && number !== undefined && (
								<motion.span
									className="text-base-300 flex font-mono text-sm"
									layoutId={mobileNumberLayoutId}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									({number})
								</motion.span>
							)}
						</AnimatePresence>
					</div>
					<button
						onClick={toggleMobileMenu}
						className="flex items-center justify-center"
						aria-label="Toggle menu"
					>
						<AnimatedMenuIcon isOpen={isMobileMenuOpen} size={24} />
					</button>
				</div>

				<AnimatePresence>
					{isMobileMenuOpen && (
						<div
							className="fixed inset-0 z-40"
							onClick={(e) => {
								toggleMobileMenu();
							}}
						>
							{/* Radial background */}
							<motion.div
								className="pointer-events-none absolute inset-0"
								style={{
									background:
										"radial-gradient(circle at top center, rgba(246, 246, 245, 0.8) 0%, rgba(246, 246, 245, 0.6) 30%, rgba(246, 246, 245, 0.2) 50%, rgba(246, 246, 245, 0.02) 70%, transparent 85%)",
									transformOrigin: "top center",
								}}
								initial={{ scale: 0, opacity: 0.5 }}
								animate={{ scale: 3, opacity: 1 }}
								exit={{
									scale: 0,
									opacity: 0.5,
									transition: { ease: "easeIn", duration: 0.3 },
								}}
								transition={defaultTransition}
							/>

							{/* Progressive blur overlay */}
							<ProgressiveBlur
								direction="top"
								blurLayers={10}
								blurIntensity={1}
								className="pointer-events-none absolute inset-x-0 top-0 h-[125vh]"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{
									opacity: 0,
									transition: { ease: "easeIn", duration: 0.3 },
								}}
								transition={defaultTransition}
							/>

							{/* Content container */}
							<motion.div
								className="relative mx-auto w-full max-w-[528px] pt-[60px]"
								initial={{ y: -10, opacity: 0 }}
								animate={{
									y: 0,
									opacity: 1,
								}}
								exit={{ y: -10, opacity: 0 }}
								transition={defaultTransition}
								onClick={(e) => e.stopPropagation()}
							>
								{mobileContent}
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</>
		);
	}

	return (
		<MotionConfig transition={defaultTransition}>
			<motion.div
				className="bg-base-50 flex h-screen flex-col justify-between overflow-hidden"
				initial={{ width: 400 }}
				animate={{
					width: isExpanded ? 400 : 64,
				}}
			>
				<AnimatePresence mode="popLayout">
					{isExpanded ? (
						<motion.div
							className="flex h-full w-[400px] flex-col justify-between"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							key="expanded"
						>
							{desktopContent}
							<div className="flex w-full items-center justify-end p-4">
								<motion.button
									onClick={handleToggleSidebar}
									className="text-base-500 flex cursor-pointer items-center justify-center rounded-md"
									aria-label="Toggle menu"
									initial={{ opacity: 0, x: 40 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 40 }}
									whileHover={{ x: -3 }}
								>
									<ArrowLeft size={20} />
								</motion.button>
							</div>
						</motion.div>
					) : (
						<motion.div
							className="flex h-full w-16 flex-col items-center justify-between p-4"
							initial={{ opacity: 0, x: -40 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -40 }}
							key="collapsed"
						>
							<div className="h-4 w-4" />
							<div
								onClick={handleToggleSidebar}
								className="text-vertical flex cursor-pointer items-baseline gap-2 p-6 select-none"
							>
								<span className="text-base-900 text-3xl font-medium">
									{title}
								</span>
								{number !== undefined && (
									<span className="text-base-300 flex font-mono text-sm">
										<span>(</span>
										<SlidingNumber value={number} />
										<span>)</span>
									</span>
								)}
							</div>
							<motion.button
								onClick={handleToggleSidebar}
								className="text-base-500 flex cursor-pointer items-center justify-center rounded-md"
								aria-label="Toggle menu"
								initial={{ opacity: 0, x: -40 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -40 }}
								whileHover={{ x: 3 }}
							>
								<ArrowRight size={20} />
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</MotionConfig>
	);
}
