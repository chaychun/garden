import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
	scrollAreaId: string;
}

export default function Sidebar({ scrollAreaId }: SidebarProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	const scrollContainerRef = useRef<HTMLElement | null>(null);
	const isManualToggleRef = useRef(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Find the scroll container (ScrollArea viewport)
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

	// Scroll-based sidebar toggle
	useEffect(() => {
		if (isMobile || !scrollContainerRef.current) return;

		const handleScroll = () => {
			if (isManualToggleRef.current) return;

			const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

			if (scrollLeft === 0) {
				if (!isExpanded) {
					setIsExpanded(true);
				}
			} else {
				if (isExpanded) {
					setIsExpanded(false);
				}
			}
		};

		const scrollContainer = scrollContainerRef.current;
		scrollContainer.addEventListener("scroll", handleScroll);

		return () => {
			scrollContainer.removeEventListener("scroll", handleScroll);
		};
	}, [isExpanded, isMobile]);

	const toggleSidebar = () => {
		isManualToggleRef.current = true;

		if (!isExpanded) {
			const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

			if (scrollLeft !== 0) {
				scrollContainerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
			}
			setIsExpanded(true);
		} else {
			setIsExpanded(false);
		}

		setTimeout(() => {
			isManualToggleRef.current = false;
		}, 600);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
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

	// Desktop sidebar - now as a flex item instead of absolute positioned
	return (
		<div
			className={`h-screen bg-green-500 shadow-lg ${
				isExpanded ? "w-[400px]" : "w-16"
			}`}
		>
			<div className="h-full p-6 text-white">
				{isExpanded ? (
					<div>
						<div className="mb-4 text-lg font-bold">Sidebar</div>
						<div className="mb-4 text-sm">Expanded content goes here</div>
						<div className="mb-4 text-sm">
							This is a test sidebar with green background
						</div>
						<button
							onClick={toggleSidebar}
							className="mt-4 rounded bg-white px-3 py-1 text-sm text-green-500 hover:bg-gray-100"
						>
							Collapse
						</button>
					</div>
				) : (
					<div className="flex h-full items-center justify-center">
						<div className="writing-mode-vertical text-center">
							<div className="-rotate-90 transform font-bold whitespace-nowrap">
								Sidebar
							</div>
							<button
								onClick={toggleSidebar}
								className="mt-4 block -rotate-90 transform rounded bg-white px-2 py-1 text-xs text-green-500 hover:bg-gray-100"
							>
								Expand
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
