import { useEffect, useMemo, useRef, useState } from "react";

export interface ImageSwapMediaProps {
	images: string[];
	alt?: string;
	intervalMs?: number;
	className?: string;
	containerClassName?: string;
	fadeMs?: number;
}

const ImageSwapMedia = ({
	images,
	alt = "",
	intervalMs = 500,
	className,
	containerClassName,
	fadeMs = 0,
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

	return (
		<div className={containerClassName}>
			{validImages.map((src, i) => (
				<img
					key={`${src}-${i}`}
					src={src}
					alt={i === index ? alt : ""}
					aria-hidden={i !== index}
					loading={i === 0 ? "eager" : "lazy"}
					decoding="async"
					style={{
						opacity: i === index ? 1 : 0,
						transition: `opacity ${Math.max(0, fadeMs)}ms ease`,
					}}
					className={className}
				/>
			))}
		</div>
	);
};

export default ImageSwapMedia;
