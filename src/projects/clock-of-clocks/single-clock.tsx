import { handleMap } from "./clock";

interface SingleClockProps {
	shape: keyof typeof handleMap;
}

export default function SingleClock({ shape }: SingleClockProps) {
	const angles = handleMap[shape];
	const isI = shape === "i";
	const handleOpacity = isI ? "opacity-20" : "opacity-100";

	return (
		<div
			className="relative aspect-square w-full"
			style={
				{
					"--handle1-rotation": `${angles.handle1}deg`,
					"--handle2-rotation": `${angles.handle2}deg`,
				} as React.CSSProperties
			}
		>
			<div
				className={`bg-base-50 absolute top-1/2 left-1/2 h-1/2 w-0.5 origin-top -translate-x-px transition-all duration-300 ease-in-out ${handleOpacity}`}
				style={{
					transform: `rotate(var(--handle1-rotation))`,
				}}
			/>

			<div
				className={`bg-base-50 absolute top-1/2 left-1/2 h-1/2 w-0.5 origin-top -translate-x-px transition-all duration-300 ease-in-out ${handleOpacity}`}
				style={{
					transform: `rotate(var(--handle2-rotation))`,
				}}
			/>

			<div
				className={`bg-base-50 absolute top-1/2 left-1/2 h-0.5 w-0.5 origin-center -translate-x-px -translate-y-1/2 transition-all duration-300 ease-in-out ${handleOpacity}`}
				style={{
					transform: `rotate(var(--handle1-rotation))`,
				}}
			/>
		</div>
	);
}
