import { SlidingNumber } from "@/components/ui/sliding-number";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef } from "react";

interface SidebarProps {
	scrollAreaId: string;
	title: string;
	desktopContent: React.ReactNode;
	number?: number;
}

export default function Sidebar({
	scrollAreaId,
	title,
	desktopContent,
	number,
}: SidebarProps) {
	const { isExpanded, isManualToggle, setExpanded, setManualToggle } =
		useSidebarStore();

	const scrollContainerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const findScrollContainer = () => {
			const scrollContainer = document.querySelector(
				`[data-scroll-area-id="${scrollAreaId}"]`,
			);
			if (scrollContainer) {
				scrollContainerRef.current = scrollContainer as HTMLElement;
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
		if (!scrollContainerRef.current) return;

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
	}, [isExpanded, isManualToggle, setExpanded]);

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

	return (
		<MotionConfig transition={defaultTransition}>
			<motion.div
				className="bg-base-50 flex h-full flex-col justify-between overflow-hidden"
				initial={{ width: 400 }}
				animate={{
					width: isExpanded ? 400 : 64,
				}}
			>
				<div className="relative h-full w-full overflow-hidden">
					<AnimatePresence mode="popLayout">
						{isExpanded ? (
							<motion.div
								className="absolute inset-0 flex h-full w-[400px] flex-col justify-between"
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
								className="absolute inset-0 flex h-full w-16 flex-col items-center justify-between p-4"
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
				</div>
			</motion.div>
		</MotionConfig>
	);
}
