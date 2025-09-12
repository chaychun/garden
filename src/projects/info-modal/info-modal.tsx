import MetadataTable from "@/components/ui/metadata-table";
import { cn } from "@/lib/utils";
import { ChevronDown, Info, X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface InfoModalProps {
	title: string;
	description: string;
	children?: React.ReactNode;
	createdDate: string;
	lastUpdatedDate: string;
	types: string[];
}

const InfoModal = ({
	title,
	description,
	children,
	createdDate,
	lastUpdatedDate,
	types,
}: InfoModalProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);

	const toggleModal = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isOpen) {
			setShowDetails(false);
		}
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		if (!isOpen) return;
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
				setShowDetails(false);
			}
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen) return;
		function handleClick(event: MouseEvent | TouchEvent) {
			const target = event.target as Node;
			if (panelRef.current && !panelRef.current.contains(target)) {
				setIsOpen(false);
				setShowDetails(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		document.addEventListener("touchstart", handleClick);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("touchstart", handleClick);
		};
	}, [isOpen]);

	const overlayClasses = cn(
		"absolute inset-0 flex items-center justify-center pointer-events-auto",
	);

	const panelClasses = cn(
		"relative bg-base-50 overflow-hidden",
		isOpen
			? "w-[min(440px,calc(100%-32px))] max-h-[calc(100%-32px)] flex flex-col"
			: "h-14 w-14",
	);

	return (
		<MotionConfig transition={{ type: "spring", duration: 0.6, bounce: 0 }}>
			<div
				className={overlayClasses}
				role={isOpen ? "dialog" : undefined}
				aria-modal={isOpen ? "true" : undefined}
				data-info-drawer
				id="info-modal"
			>
				<motion.div
					key="drawer-content"
					className={panelClasses}
					layout
					ref={panelRef}
				>
					<AnimatePresence mode="popLayout">
						{isOpen && (
							<motion.div
								key="drawer-content"
								className="scrollbar-hide min-h-0 flex-1 overflow-y-auto"
								layout
								initial={{ opacity: 0 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: { delay: 0.2, duration: 0.4 },
								}}
								exit={{ opacity: 0, y: 16, transition: { duration: 0.1 } }}
							>
								<div className="h-full px-6 pt-6 pb-0">
									<motion.h1
										key="title"
										className="text-base-900 mt-4 text-3xl font-medium"
										layout
									>
										{title}
									</motion.h1>
									<motion.p
										key="description"
										className="text-base-500 mt-2 text-base leading-[1.1]"
										layout
									>
										{description}
									</motion.p>
									<AnimatePresence mode="popLayout">
										{showDetails && (
											<motion.div
												key="details"
												className="mt-6"
												layout
												initial={{ opacity: 0 }}
												animate={{
													opacity: 1,
												}}
												exit={{ opacity: 0, transition: { duration: 0.2 } }}
											>
												<div className="text-base-700 [&_a]:text-base-500 flex flex-col gap-4 text-sm [&_a]:underline">
													{children}
												</div>
												<div className="mt-6 mb-4">
													<MetadataTable
														createdDate={createdDate}
														lastUpdatedDate={lastUpdatedDate}
														types={types}
													/>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
									{children && !showDetails && (
										<div className="mt-6 mb-4 flex justify-center">
											<motion.button
												key="toggle-details"
												onClick={(e) => {
													e.stopPropagation();
													setShowDetails(true);
												}}
												className="text-base-500 hover:text-base-700 flex cursor-pointer flex-col items-center text-sm font-light"
												layout
											>
												<span>Show more</span>
												<span>
													<ChevronDown className="h-4 w-4" strokeWidth={1} />
												</span>
											</motion.button>
										</div>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Toggle button – always present */}
					<motion.button
						key="toggle-button"
						aria-label={isOpen ? "Close info modal" : "Open info modal"}
						aria-expanded={isOpen}
						aria-controls="info-modal"
						className={cn(
							"text-base-900 flex h-14 w-14 cursor-pointer items-center justify-center",
							isOpen ? "absolute right-0 bottom-0" : "",
						)}
						onClick={(e) => toggleModal(e)}
						whileTap={{ scale: 0.9 }}
						layout
					>
						{isOpen ? (
							<X className="text-base-500 h-7 w-7" strokeWidth={1.5} />
						) : (
							<Info className="text-base-500 h-7 w-7" strokeWidth={1.5} />
						)}
					</motion.button>
				</motion.div>
			</div>
		</MotionConfig>
	);
};

export default InfoModal;
