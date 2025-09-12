import { ArrowUpRight, MousePointerClick, Plus } from "lucide-react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type CursorType = "external" | "interactive" | "default";

type HoverData = {
	title: string;
	type: CursorType;
};

export default function CursorFollower() {
	const [isVisible, setIsVisible] = useState(false);
	const [data, setData] = useState<HoverData | null>(null);
	const resumeTrackingAtRef = useRef(0);
	const isVisibleRef = useRef(false);

	const x = useSpring(0, { stiffness: 650, damping: 80, mass: 1.2 });
	const y = useSpring(0, { stiffness: 650, damping: 80, mass: 1.2 });

	const handlePointerMove = useMemo(() => {
		const offset = 14;
		return (e: PointerEvent) => {
			const now = performance.now();
			if (!isVisibleRef.current && now < resumeTrackingAtRef.current) return;
			const t = e.target as Element | null;
			const over =
				t && "closest" in t
					? (t as Element).closest("[data-cursor-hover]")
					: null;
			if (over) {
				x.set(e.clientX + offset);
				y.set(e.clientY + offset);
				return;
			}
			if (now >= resumeTrackingAtRef.current) {
				x.set(e.clientX + offset);
				y.set(e.clientY + offset);
			}
		};
	}, [x, y]);

	useEffect(() => {
		const anchors = Array.from(
			document.querySelectorAll<HTMLElement>("[data-cursor-hover]"),
		);

		function onEnter(e: Event) {
			const el = e.currentTarget as HTMLElement;
			const title = el.getAttribute("data-cursor-title") || "";
			const typeAttr = el.getAttribute("data-cursor-type");
			let type: CursorType = "default";
			if (typeAttr === "external" || typeAttr === "interactive")
				type = typeAttr;

			setData({ title, type });
			setIsVisible(true);
			isVisibleRef.current = true;
		}

		function onLeave() {
			setIsVisible(false);
			resumeTrackingAtRef.current = performance.now() + 700;
			isVisibleRef.current = false;
		}

		anchors.forEach((a) => {
			a.addEventListener("mouseenter", onEnter);
			a.addEventListener("mouseleave", onLeave);
		});

		document.addEventListener("pointermove", handlePointerMove, {
			passive: true,
		});

		return () => {
			anchors.forEach((a) => {
				a.removeEventListener("mouseenter", onEnter);
				a.removeEventListener("mouseleave", onLeave);
			});
			document.removeEventListener("pointermove", handlePointerMove);
		};
	}, [handlePointerMove]);

	const variants = {
		show: {
			opacity: 1,
			scale: 1,
			transition: { duration: 0.5, ease: "easeOut" },
		},
		hide: {
			opacity: 0,
			scale: 0.98,
			transition: { delay: 0.2, duration: 0.5, ease: "easeOut" },
		},
	} as const;

	return (
		<AnimatePresence>
			{isVisible && data && (
				<motion.div
					layoutRoot
					key="cursor-follower"
					initial="hide"
					animate="show"
					exit="hide"
					variants={variants}
					className="pointer-events-none fixed top-0 left-0 z-[100] select-none"
					style={{ x, y, position: "fixed" }}
				>
					<motion.div
						layout
						className="bg-base-950/80 text-base-50 inline-block overflow-hidden p-1 pr-2 shadow-sm backdrop-blur-md"
					>
						<div className="flex items-center gap-1">
							<motion.div
								layout
								className="font-switzer text-base-50 leading-none select-none"
								transition={{ type: "spring", duration: 0.5, bounce: 0 }}
							>
								<AnimatePresence mode="popLayout" initial={false}>
									<motion.div
										key={data.type}
										className="min-w-0"
										initial={{ opacity: 0 }}
										animate={{
											opacity: 1,
											transition: { duration: 0.2, ease: "easeIn", delay: 0.2 },
										}}
										exit={{
											opacity: 0,
											transition: { type: "spring", duration: 0.2, bounce: 0 },
										}}
										layout
									>
										{data.type === "external" ? (
											<ArrowUpRight className="h-[11px] w-[11px]" />
										) : data.type === "interactive" ? (
											<MousePointerClick className="h-[11px] w-[11px]" />
										) : (
											<Plus className="h-[11px] w-[11px]" />
										)}
									</motion.div>
								</AnimatePresence>
							</motion.div>
							<AnimatePresence mode="popLayout" initial={false}>
								<motion.div
									className="min-w-0"
									key={data.title}
									initial={{ opacity: 0 }}
									animate={{
										opacity: 1,
										transition: { duration: 0.2, ease: "easeIn", delay: 0.2 },
									}}
									exit={{
										opacity: 0,
										transition: { type: "spring", duration: 0.2, bounce: 0 },
									}}
								>
									<div className="font-switzer w-fit max-w-[40vw] truncate text-[11px] leading-none font-medium uppercase md:max-w-[24rem]">
										{data.title}
									</div>
								</motion.div>
							</AnimatePresence>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
