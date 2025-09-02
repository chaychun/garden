import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";
import { easeOut } from "motion";
import { AnimatePresence, motion, stagger } from "motion/react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { createPortal } from "react-dom";

interface BlurDialogContextValue {
	open: boolean;
	setOpen: (value: boolean) => void;
	toggle: () => void;
	close: () => void;
}

const BlurDialogContext = createContext<BlurDialogContextValue | null>(null);

export function useBlurDialogContext() {
	const ctx = useContext(BlurDialogContext);
	if (!ctx)
		throw new Error("BlurDialog components must be used within <BlurDialog>");
	return ctx;
}

interface BlurDialogProps {
	children: React.ReactNode;
	className?: string;
}

export function BlurDialog({ children, className }: BlurDialogProps) {
	const [open, setOpen] = useState(false);
	const toggle = useCallback(() => setOpen((v) => !v), []);
	const close = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const isMobile = window.innerWidth < 768;
		if (isMobile && open) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			document.documentElement.classList.add("mobile-menu-open");
		} else {
			document.documentElement.classList.remove("mobile-menu-open");
		}
		return () => {
			document.documentElement.classList.remove("mobile-menu-open");
		};
	}, [open]);

	const value = useMemo(
		() => ({ open, setOpen, toggle, close }),
		[open, toggle, close],
	);

	return (
		<BlurDialogContext.Provider value={value}>
			<div className={cn("relative", className)}>{children}</div>
		</BlurDialogContext.Provider>
	);
}

interface BlurDialogTriggerProps {
	children: React.ReactNode | ((open: boolean) => React.ReactNode);
	className?: string;
}

export function BlurDialogTrigger({
	children,
	className,
}: BlurDialogTriggerProps) {
	const { open, toggle } = useBlurDialogContext();
	const content =
		typeof children === "function"
			? (children as (o: boolean) => React.ReactNode)(open)
			: children;
	return (
		<div className={className} onClick={toggle}>
			{content}
		</div>
	);
}

interface BlurDialogContentProps {
	children: React.ReactNode;
	className?: string;
	overlayClassName?: string;
	overlayZIndex?: number;
}

export function BlurDialogContent({
	children,
	className,
	overlayClassName,
	overlayZIndex = 30,
}: BlurDialogContentProps) {
	const { open, close } = useBlurDialogContext();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const overlay = (
		<AnimatePresence>
			{open && (
				<div
					className={cn("fixed inset-x-0 top-0", overlayClassName)}
					style={{ zIndex: overlayZIndex }}
					onClick={close}
				>
					<motion.div
						className="fixed inset-0"
						style={{
							background:
								"linear-gradient(to bottom, rgba(248, 248, 247, 0.7) 0%, rgba(248, 248, 247, 0.6) 20%, rgba(248, 248, 247, 0.1) 70%, transparent 100%)",
							transformOrigin: "top center",
						}}
						initial={{ scale: 1, opacity: 0 }}
						animate={{ scale: 3, opacity: 1 }}
						exit={{
							scale: 1,
							opacity: 0,
							transition: { ease: "easeIn", duration: 0.3 },
						}}
						transition={{ duration: 0.4, ease: easeOut }}
					/>
					<ProgressiveBlur
						direction="top"
						blurLayers={10}
						blurIntensity={5}
						className="absolute inset-x-0 top-0 h-[120dvh]"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{
							opacity: 0,
							transition: { ease: "easeIn", duration: 0.3 },
						}}
						transition={{ duration: 0.4, ease: easeOut }}
					/>
				</div>
			)}
		</AnimatePresence>
	);

	return (
		<>
			{mounted && typeof document !== "undefined"
				? createPortal(overlay, document.body)
				: null}
			<AnimatePresence>
				{open && (
					<motion.div
						className={cn(
							"absolute top-full right-0 left-0 z-50 mt-6 max-w-[min(92vw,720px)] md:-right-full",
							className,
						)}
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={BlurDialogVariants.container}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export const BlurDialogVariants = {
	container: {
		hidden: {
			transition: {
				duration: 0.3,
				delayChildren: stagger(0.05, { from: "last" }),
				ease: easeOut,
			},
		},
		visible: {
			transition: {
				duration: 0.3,
				delayChildren: stagger(0.05),
				ease: easeOut,
			},
		},
	},
	block: {
		hidden: { opacity: 0, y: 8, filter: "blur(8px)" },
		visible: {
			opacity: 1,
			y: 0,
			filter: "blur(0px)",
			transition: { duration: 0.2, ease: easeOut },
		},
	},
};
