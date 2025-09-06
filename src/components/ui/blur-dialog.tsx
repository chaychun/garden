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
	disableScrollBarAdjustment?: boolean;
}

export function BlurDialog({
	children,
	className,
	disableScrollBarAdjustment,
}: BlurDialogProps) {
	const [open, setOpen] = useState(false);
	const toggle = useCallback(() => setOpen((v) => !v), []);
	const close = useCallback(() => setOpen(false), []);

	useEffect(() => {
		if (typeof document === "undefined") return;
		if (disableScrollBarAdjustment) {
			document.documentElement.classList.remove("mobile-menu-open");
			return;
		}
		if (open) {
			document.documentElement.classList.add("mobile-menu-open");
			return () => {
				document.documentElement.classList.remove("mobile-menu-open");
			};
		}
		document.documentElement.classList.remove("mobile-menu-open");
		return undefined;
	}, [open, disableScrollBarAdjustment]);

	useEffect(() => {
		if (!open) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, close]);

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
	children: React.ReactElement | ((open: boolean) => React.ReactElement);
	className?: string;
	disableEventBubbling?: boolean;
}

export function BlurDialogTrigger({
	children,
	className,
	disableEventBubbling = true,
}: BlurDialogTriggerProps) {
	const { open, toggle } = useBlurDialogContext();
	const element =
		typeof children === "function"
			? (children as (o: boolean) => React.ReactElement)(open)
			: children;

	return (
		<div
			className={className}
			onClick={(e) => {
				if (disableEventBubbling) e.stopPropagation();
				if (!e.defaultPrevented) {
					if (
						!open &&
						typeof window !== "undefined" &&
						window.innerWidth < 768
					) {
						window.scrollTo({ top: 0, behavior: "smooth" });
					}
					toggle();
				}
			}}
			onKeyDown={(e) => {
				if (e.defaultPrevented) return;
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					if (disableEventBubbling) e.stopPropagation();
					if (
						!open &&
						typeof window !== "undefined" &&
						window.innerWidth < 768
					) {
						window.scrollTo({ top: 0, behavior: "smooth" });
					}
					toggle();
				}
			}}
			role="button"
			tabIndex={0}
			aria-expanded={open}
			aria-haspopup="dialog"
		>
			{element}
		</div>
	);
}

interface BlurDialogContentProps {
	children: React.ReactNode;
	className?: string;
	overlayClassName?: string;
	overlayZIndex?: number;
	ariaLabelledby?: string;
	ariaDescribedby?: string;
}

export function BlurDialogContent({
	children,
	className,
	overlayClassName,
	overlayZIndex = 9990,
	ariaLabelledby,
	ariaDescribedby,
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
						role="dialog"
						aria-modal="true"
						aria-labelledby={ariaLabelledby}
						aria-describedby={ariaDescribedby}
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
