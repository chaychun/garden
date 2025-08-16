import {
	AnimatePresence,
	motion,
	useMotionValue,
	useSpring,
} from "motion/react";
import { useEffect, useMemo, useState } from "react";

type HoverData = {
	title: string;
	types: string[];
};

export default function CursorFollower() {
	const [isVisible, setIsVisible] = useState(false);
	const [data, setData] = useState<HoverData | null>(null);

	const rawX = useMotionValue(0);
	const rawY = useMotionValue(0);

	const x = useSpring(rawX, { stiffness: 650, damping: 80, mass: 1.2 });
	const y = useSpring(rawY, { stiffness: 650, damping: 80, mass: 1.2 });

	const handlePointerMove = useMemo(() => {
		const offset = 14;
		return (e: PointerEvent) => {
			rawX.set(e.clientX + offset);
			rawY.set(e.clientY + offset);
			const t = e.target as Element | null;
			const over =
				t && "closest" in t
					? (t as Element).closest("[data-cursor-hover]")
					: null;
			if (!over) setIsVisible(false);
		};
	}, [rawX, rawY]);

	useEffect(() => {
		const anchors = Array.from(
			document.querySelectorAll<HTMLElement>("[data-cursor-hover]"),
		);

		function onEnter(e: Event) {
			const el = e.currentTarget as HTMLElement;
			const title = el.getAttribute("data-cursor-title") || "";
			const rawTypes = el.getAttribute("data-cursor-types") || "";
			const types = rawTypes
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean);

			setData({ title, types });
			setIsVisible(true);
		}

		function onLeave() {
			setIsVisible(false);
		}

		anchors.forEach((a) => {
			a.addEventListener("mouseenter", onEnter);
			a.addEventListener("mouseleave", onLeave);
		});

		document.addEventListener("pointermove", handlePointerMove);

		return () => {
			anchors.forEach((a) => {
				a.removeEventListener("mouseenter", onEnter);
				a.removeEventListener("mouseleave", onLeave);
			});
			document.removeEventListener("pointermove", handlePointerMove);
		};
	}, [handlePointerMove]);

	const typesText = useMemo(() => {
		if (!data?.types?.length) return "";
		return data.types
			.map((t) => (t ? `${t.slice(0, 1).toUpperCase()}${t.slice(1)}` : ""))
			.join(" / ");
	}, [data?.types]);

	return (
		<AnimatePresence>
			{isVisible && data && (
				<motion.div
					key="cursor-follower"
					initial={{ opacity: 0, scale: 0.98 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.98 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="pointer-events-none fixed top-0 left-0 z-[100] select-none"
					style={{ x, y }}
				>
					<div className="bg-base-950/80 text-base-50 px-2 py-1 text-[11px] leading-tight shadow-sm backdrop-blur-md">
						<div className="flex items-start gap-1">
							<div className="font-switzer text-base-50 text-sm leading-none select-none">
								+
							</div>
							<div className="min-w-0">
								<div className="font-switzer max-w-[40vw] truncate font-medium md:max-w-[24rem]">
									{data.title}
								</div>
								{typesText ? (
									<div className="font-switzer text-base-400 max-w-[40vw] truncate md:max-w-[24rem]">
										{typesText}
									</div>
								) : null}
							</div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
