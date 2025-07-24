import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
	scrollAreaId: string;
	title: string;
	children: React.ReactNode;
}

export default function Sidebar({
	scrollAreaId,
	title,
	children,
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
				<div className="relative z-50 mx-auto flex w-full max-w-[528px] items-center justify-between bg-blue-500 px-6 py-4">
					<h1 className="text-white">Test top bar</h1>
					<button
						onClick={toggleMobileMenu}
						className="flex items-center justify-center rounded-md text-white"
						aria-label="Toggle menu"
					>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{isMobileMenuOpen && (
					<div className="fixed inset-0 z-40">
						<div className="mx-auto h-full w-full max-w-[528px] bg-blue-500 pt-[72px]">
							<div className="h-full p-6 text-white">
								<div className="mb-4 text-lg font-bold">Sidebar</div>
								<div className="mb-4 text-sm">
									Mobile menu content goes here
								</div>
								<div className="mb-4 text-sm">
									This is the expanded mobile sidebar
								</div>
							</div>
						</div>
					</div>
				)}
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
							{children}
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
								className="text-vertical text-base-900 font-cabinet cursor-pointer p-6 text-2xl font-medium select-none"
							>
								{title}
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
