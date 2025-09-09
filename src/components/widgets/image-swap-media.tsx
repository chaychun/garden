import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface ImageSwapMediaProps {
	images: string[];
	alt?: string;
	intervalMs?: number;
	className?: string;
	imageStyle?: CSSProperties;
	aspect?: "portrait" | "landscape" | "square";
}

const ImageSwapMedia = ({
	images,
	alt = "",
	intervalMs = 500,
	className,
	imageStyle,
	aspect,
}: ImageSwapMediaProps) => {
	const validImages = useMemo(() => images.filter(Boolean), [images]);
	const [index, setIndex] = useState(0);
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		if (validImages.length <= 1) return;
		if (timerRef.current) window.clearInterval(timerRef.current);
		timerRef.current = window.setInterval(
			() => {
				setIndex((prev) => (prev + 1) % validImages.length);
			},
			Math.max(100, intervalMs),
		);
		return () => {
			if (timerRef.current) window.clearInterval(timerRef.current);
		};
	}, [validImages, intervalMs]);

	if (validImages.length === 0) return null;

	const aspectRatioCss = (() => {
		if (!aspect) return undefined;
		const map = {
			portrait: "4 / 5",
			landscape: "5 / 4",
			square: "1 / 1",
		} as const;
		return map[aspect] ?? undefined;
	})();

	return (
		<img
			src={validImages[index]}
			alt={alt}
			loading={index === 0 ? "eager" : "lazy"}
			decoding="async"
			style={{
				aspectRatio: aspectRatioCss,
				...imageStyle,
			}}
			className={className}
		/>
	);
};

export default ImageSwapMedia;
