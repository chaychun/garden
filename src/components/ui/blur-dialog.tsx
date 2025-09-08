import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";
import { animate, stagger } from "motion";
import { AnimatePresence, motion } from "motion/react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { ScrollArea } from "./scroll-area";

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
	keepMounted?: boolean;
}

export function BlurDialogContent({
	children,
	className,
	overlayClassName,
	overlayZIndex = 9990,
	ariaLabelledby,
	ariaDescribedby,
	keepMounted,
}: BlurDialogContentProps) {
	const { open, close } = useBlurDialogContext();
	const [mounted, setMounted] = useState(false);
	const contentRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		const root = contentRef.current;
		if (!root) return;
		const nodes = root.querySelectorAll<HTMLElement>(
			"[data-blur-dialog-stagger] > *, [data-blur-dialog-stagger] > astro-slot > *",
		);
		const elements = Array.from(nodes);
		if (!elements.length) return;
		const count = elements.length;
		const totalStaggerTarget = 0.4;
		const maxPerStepDelay = 0.05;
		const perStepDelay = Math.min(
			maxPerStepDelay,
			totalStaggerTarget / Math.max(1, count),
		);

		if (open) {
			const delayFor = stagger(perStepDelay);
			const enterKeyframes = {
				opacity: [0, 1],
				y: [8, 0],
				filter: ["blur(8px)", "blur(0px)"],
			};
			elements.forEach((el, i) => {
				animate(el, enterKeyframes, {
					delay: delayFor(i, elements.length),
					duration: 0.2,
					ease: "easeOut",
				});
			});
		} else {
			const delayFor = stagger(perStepDelay, { from: "last" });
			const exitKeyframes = {
				opacity: [1, 0],
				y: [0, 8],
				filter: ["blur(0px)", "blur(8px)"],
			};
			elements.forEach((el, i) => {
				animate(el, exitKeyframes, {
					delay: delayFor(i, elements.length),
					duration: 0.2,
					ease: "easeOut",
				});
			});
		}
	}, [open]);

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
							transition: { ease: "easeInOut", duration: 0.4 },
						}}
						transition={{ duration: 0.4, ease: "easeInOut" }}
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
							transition: { ease: "easeInOut", duration: 0.4 },
						}}
						transition={{ duration: 0.4, ease: "easeInOut" }}
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
			{keepMounted ? (
				<motion.div
					ref={contentRef}
					className={cn(
						"absolute top-full right-0 left-0 z-50 mt-6 w-full",
						!open && "pointer-events-none",
						className,
					)}
					role="dialog"
					aria-modal="true"
					aria-hidden={!open || undefined}
					aria-labelledby={ariaLabelledby}
					aria-describedby={ariaDescribedby}
					initial={false}
					animate={
						open
							? { opacity: 1, y: 0, filter: "blur(0px)" }
							: { opacity: 0, y: 8, filter: "blur(8px)" }
					}
					transition={{ duration: 0.4, ease: "easeInOut" }}
				>
					<ScrollArea className="h-[70dvh]">{children}</ScrollArea>
				</motion.div>
			) : (
				<AnimatePresence>
					{open && (
						<motion.div
							ref={contentRef}
							className={cn(
								"absolute top-full right-0 left-0 z-50 mt-6 w-full",
								className,
							)}
							role="dialog"
							aria-modal="true"
							aria-labelledby={ariaLabelledby}
							aria-describedby={ariaDescribedby}
							initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							exit={{
								opacity: 0,
								y: 8,
								filter: "blur(8px)",
							}}
							transition={{ duration: 0.4, ease: "easeInOut" }}
						>
							<ScrollArea className="h-[70dvh]">{children}</ScrollArea>
						</motion.div>
					)}
				</AnimatePresence>
			)}
		</>
	);
}
