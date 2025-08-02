import MetadataTable from "@/components/ui/metadata-table";
import { cn } from "@/lib/utils";
import { ChevronDown, Info, X } from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface InfoDrawerProps {
	title: string;
	description: string;
	children?: React.ReactNode;
	createdDate: string;
	lastUpdatedDate: string;
	technologies: string[];
}

const InfoDrawer = ({
	title,
	description,
	children,
	createdDate,
	lastUpdatedDate,
	technologies,
}: InfoDrawerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const drawerRef = useRef<HTMLDivElement>(null);

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
			if (drawerRef.current && !drawerRef.current.contains(target)) {
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

	const fixedContainerClasses = cn(
		"fixed bottom-4 z-1000",
		isOpen ? "left-4 right-4" : "right-4",
	);

	const relativeContainerClasses = cn(
		"relative bg-base-50 overflow-hidden",
		isOpen ? "" : "h-14 w-14",
	);

	return (
		<MotionConfig transition={{ type: "spring", duration: 0.6, bounce: 0 }}>
			<div
				ref={drawerRef}
				className={fixedContainerClasses}
				role={isOpen ? "dialog" : undefined}
				aria-modal={isOpen ? "true" : undefined}
				data-info-drawer
			>
				<motion.div
					key="drawer-content"
					className={relativeContainerClasses}
					layout
				>
					<AnimatePresence mode="popLayout">
						{isOpen && (
							<motion.div
								key="drawer-content"
								className="flex max-h-[calc(100dvh-32px)] flex-col"
								layout
								initial={{ opacity: 0, y: 16 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: { delay: 0.2, duration: 0.4 },
								}}
								exit={{ opacity: 0, y: 16, transition: { duration: 0.1 } }}
							>
								<div className="flex-1 overflow-y-auto px-6 pt-6 pb-0">
									<motion.h1
										key="title"
										className="text-base-900 font-cabinet mt-4 text-3xl font-medium"
										layout
									>
										{title}
									</motion.h1>
									<motion.p
										key="description"
										className="text-base-500 mt-2 font-mono text-base"
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
												<div className="text-base-700 flex flex-col gap-4 text-sm">
													{children}
												</div>
												<div className="mt-6 mb-4">
													<MetadataTable
														createdDate={createdDate}
														lastUpdatedDate={lastUpdatedDate}
														technologies={technologies}
													/>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
									{children && !showDetails && (
										<div className="mt-6 mb-4 flex justify-center">
											<motion.button
												key="toggle-details"
												onClick={() => setShowDetails(true)}
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
						aria-label={isOpen ? "Close info drawer" : "Open info drawer"}
						aria-expanded={isOpen}
						aria-controls="info-drawer"
						className="text-base-900 absolute right-0 bottom-0 flex h-14 w-14 cursor-pointer items-center justify-center"
						onClick={() => {
							if (isOpen) {
								setShowDetails(false);
							}
							setIsOpen(!isOpen);
						}}
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

export default InfoDrawer;
