import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import useMeasure from "react-use-measure";

interface Props {
	title: string;
	description: string;
	createdDate: string;
	lastUpdatedDate: string;
	types: string[];
	scrollAreaId: string;
	children?: React.ReactNode;
}

const InfoSideBar = ({ title, description, scrollAreaId, children }: Props) => {
	// Collapse sidebar by default when running in the development server, otherwise expand
	const [isCollapsed, setIsCollapsed] = useState(() => import.meta.env.DEV);
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [expandedMobileWidth, setExpandedMobileWidth] = useState(0);
	const [measureRef, bounds] = useMeasure();
	const containerRef = useRef<HTMLDivElement | null>(null);
	const setContainerAndMeasureRef = useCallback(
		(node: HTMLDivElement | null) => {
			containerRef.current = node;
			measureRef(node);
		},
		[measureRef],
	);
	const prevScrollYRef = useRef(0);
	const sidebarRef = useRef<HTMLElement>(null);
	const scrollContainerRef = useRef<HTMLElement | null>(null);
	const contentId = `info-sidebar-content-${scrollAreaId}`;
	const titleId = `info-sidebar-title-${scrollAreaId}`;

	// Handle scroll-based collapse/expand
	const handleScroll = useCallback(() => {
		const container = scrollContainerRef.current;
		const currentScrollY = container ? container.scrollTop : 0;
		const prevScrollY = prevScrollYRef.current;

		if (prevScrollY === 0 && currentScrollY > 0) {
			setIsCollapsed(true);
		} else if (currentScrollY === 0 && prevScrollY > 0) {
			setIsCollapsed(false);
		}

		prevScrollYRef.current = currentScrollY;
	}, []);

	useEffect(() => {
		let ticking = false;
		let currentContainer: HTMLElement | null = null;

		const throttledScrollHandler = () => {
			if (!ticking) {
				requestAnimationFrame(() => {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		};

		const attachListeners = () => {
			const newContainer = document.querySelector(
				`[data-scroll-area-id="${scrollAreaId}"]`,
			) as HTMLElement | null;
			if (newContainer === currentContainer) return;

			if (currentContainer) {
				currentContainer.removeEventListener("scroll", throttledScrollHandler);
			}
			currentContainer = newContainer;
			scrollContainerRef.current = newContainer;
			if (newContainer) {
				newContainer.addEventListener("scroll", throttledScrollHandler, {
					passive: true,
				});
			}

			handleScroll();
		};

		attachListeners();
		document.addEventListener("astro:page-load", attachListeners);

		return () => {
			if (currentContainer) {
				currentContainer.removeEventListener("scroll", throttledScrollHandler);
			}
			document.removeEventListener("astro:page-load", attachListeners);
		};
	}, [handleScroll, scrollAreaId]);

	// Track small screens to make the expanded sidebar full-width on <640px
	useEffect(() => {
		if (typeof window === "undefined") return;
		const mediaQuery = window.matchMedia("(max-width: 639.98px)");
		const update = () => setIsSmallScreen(mediaQuery.matches);
		update();
		if (typeof mediaQuery.addEventListener === "function") {
			mediaQuery.addEventListener("change", update);
		}
		return () => {
			if (typeof mediaQuery.removeEventListener === "function") {
				mediaQuery.removeEventListener("change", update);
			}
		};
	}, []);

	// Seed width synchronously to avoid a 0 width on first open
	useLayoutEffect(() => {
		if (!isSmallScreen) return;
		const measure = () => {
			const width = containerRef.current?.getBoundingClientRect().width ?? 0;
			if (width > 0) setExpandedMobileWidth(Math.round(width));
		};
		measure();
		if (expandedMobileWidth === 0) {
			requestAnimationFrame(measure);
		}
	}, [isSmallScreen, expandedMobileWidth]);

	// Update cached container width on small screens using react-use-measure
	useEffect(() => {
		if (!isSmallScreen) return;
		if (bounds.width > 0) {
			setExpandedMobileWidth(Math.round(bounds.width));
		}
	}, [bounds.width, isSmallScreen]);

	// Collapse sidebar when Escape key is pressed and on click outside
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsCollapsed(true);
			}
		};

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node | null;
			if (!sidebarRef.current || !target) return;
			if (!sidebarRef.current.contains(target)) {
				setIsCollapsed(true);
			}
		};

		if (!isCollapsed) {
			document.addEventListener("keydown", handleKeyDown);
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isCollapsed]);

	const toggleCollapsed = () => {
		setIsCollapsed((prev) => !prev);
	};

	// Expand sidebar when any area inside it is clicked (collapsed state only)
	const handleSidebarClick = (e: React.MouseEvent<HTMLElement>) => {
		// Prevent the click from bubbling up to the document listener
		e.stopPropagation();
		if (isCollapsed) {
			setIsCollapsed(false);
		}
	};

	const defaultTransition = {
		type: "spring" as const,
		duration: 0.8,
		bounce: 0,
	};

	const measuredWidth = Math.round(bounds.width || 0);
	const expandedWidth = isSmallScreen
		? expandedMobileWidth || measuredWidth || "100%"
		: 440;

	return (
		<MotionConfig transition={defaultTransition}>
			<div ref={setContainerAndMeasureRef} className="relative h-full w-full">
				<motion.aside
					ref={sidebarRef}
					role="complementary"
					aria-labelledby={titleId}
					onClick={handleSidebarClick}
					className="bg-base-100 absolute top-0 bottom-0 left-0 z-[1000] overflow-hidden"
					initial={{ width: 0 }}
					animate={{ width: isCollapsed ? 64 : expandedWidth }}
				>
					<AnimatePresence mode="popLayout">
						{isCollapsed ? (
							<motion.div
								className="pointer-events-none absolute inset-0 flex h-full w-[64px] flex-col items-center p-4 select-none"
								initial={{ opacity: 0, x: -40 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -40 }}
								transition={{ ...defaultTransition }}
								key="collapsed"
							>
								<h1
									id={titleId}
									className="text-base-900 text-vertical flex-1 text-center text-2xl font-medium"
								>
									{title}
								</h1>

								<motion.button
									onClick={toggleCollapsed}
									aria-label="Expand sidebar"
									aria-controls={contentId}
									aria-expanded={!isCollapsed}
									type="button"
									className="pointer-events-auto cursor-pointer"
								>
									<ArrowRight
										className="text-base-500 h-6 w-6"
										strokeWidth={1}
									/>
								</motion.button>
							</motion.div>
						) : (
							<motion.div
								id={contentId}
								className="absolute inset-0 flex h-full flex-col items-center justify-between p-4"
								style={{ width: expandedWidth }}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ ...defaultTransition }}
								key="expanded"
							>
								<div className="flex flex-1 flex-col justify-between pt-20">
									<motion.div>
										<h1
											id={titleId}
											className="text-base-900 text-4xl font-bold"
										>
											{title}
										</h1>
										<p className="text-base-500 mt-2">{description}</p>
									</motion.div>

									<motion.div className="flex flex-col gap-4 text-sm">
										{children}
									</motion.div>

									<motion.div className="relative">
										<motion.button
											onClick={toggleCollapsed}
											aria-label="Collapse sidebar"
											aria-controls={contentId}
											aria-expanded={!isCollapsed}
											type="button"
											className="absolute right-0 bottom-0 cursor-pointer"
											initial={{ opacity: 0, x: 40 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 40 }}
											transition={{ ...defaultTransition }}
										>
											<ArrowLeft
												className="text-base-500 h-6 w-6"
												strokeWidth={1}
											/>
										</motion.button>
									</motion.div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.aside>
			</div>
		</MotionConfig>
	);
};

export default InfoSideBar;
