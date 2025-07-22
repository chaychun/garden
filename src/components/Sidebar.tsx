import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
	scrollAreaId: string;
	title: string;
}

export default function Sidebar({ scrollAreaId, title }: SidebarProps) {
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
			className={cn(
				"bg-base-50 flex h-screen flex-col justify-between",
				isExpanded ? "w-[400px]" : "w-16 items-center p-4",
			)}
		>
			{isExpanded ? (
				<>
					<div className="flex w-full items-center justify-between p-4">
						<div className="text-base-900 text-lg font-semibold">Chayut</div>
						<a href="/" className="text-base-500 text-sm underline">
							About
						</a>
					</div>
					<h1 className="text-base-900 font-cabinet p-6 text-4xl font-medium">
						{title}
					</h1>
					<div className="flex w-full items-center justify-end p-4">
						<button
							onClick={toggleSidebar}
							className="text-base-500 flex items-center justify-center rounded-md"
							aria-label="Toggle menu"
						>
							<ArrowLeft size={20} />
						</button>
					</div>
				</>
			) : (
				<>
					<div className="h-4 w-4" />
					<div className="text-vertical text-base-900 font-cabinet p-6 text-2xl font-medium">
						{title}
					</div>
					<button
						onClick={toggleSidebar}
						className="text-base-500 flex items-center justify-center rounded-md"
						aria-label="Toggle menu"
					>
						<ArrowRight size={20} />
					</button>
				</>
			)}
		</div>
	);
}
