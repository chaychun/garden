import { AnimatedMenuIcon } from "@/components/ui/animated-menu-icon";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { useSidebarStore } from "@/lib/stores/sidebarStore";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface MobileTopBarProps {
	title: string;
	number?: number;
	mobileTitleLayoutId?: string;
	mobileNumberLayoutId?: string;
	children?: React.ReactNode;
}

export default function MobileTopBar({
	title,
	number,
	mobileTitleLayoutId,
	mobileNumberLayoutId,
	children,
}: MobileTopBarProps) {
	const { isMobileMenuOpen, toggleMobileMenu } = useSidebarStore();

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.documentElement.classList.add("mobile-menu-open");
		} else {
			document.documentElement.classList.remove("mobile-menu-open");
		}

		return () => {
			document.documentElement.classList.remove("mobile-menu-open");
		};
	}, [isMobileMenuOpen]);

	const defaultTransition = {
		type: "spring" as const,
		duration: 0.8,
		bounce: 0,
	};

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
								key={`mobile-title-closed-${title}`}
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
								key={`mobile-number-${title}-${number}`}
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
						onClick={() => {
							toggleMobileMenu();
						}}
					>
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
							{children}
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}
