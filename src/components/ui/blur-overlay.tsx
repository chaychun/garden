import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { useEffect, useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";

export default function BlurOverlay() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [hovered, setHovered] = useState(false);
	const { width = 0 } = useWindowSize();
	const isDesktop = width >= 768;

	useEffect(() => {
		const parent = containerRef.current?.parentElement;
		if (!parent) return;
		const onEnter = () => setHovered(true);
		const onLeave = () => setHovered(false);
		parent.addEventListener("mouseenter", onEnter);
		parent.addEventListener("mouseleave", onLeave);
		return () => {
			parent.removeEventListener("mouseenter", onEnter);
			parent.removeEventListener("mouseleave", onLeave);
		};
	}, []);

	return (
		<div ref={containerRef} className="absolute inset-0">
			<ProgressiveBlur
				className="absolute inset-x-0 top-3/4 bottom-0"
				direction="bottom"
				blurIntensity={2}
				animate={{ opacity: !isDesktop || hovered ? 1 : 0 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
			/>
			<ProgressiveBlur
				className="absolute inset-x-0 top-0 bottom-3/4"
				direction="top"
				blurIntensity={2}
				animate={{ opacity: !isDesktop || hovered ? 1 : 0 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
			/>
		</div>
	);
}
