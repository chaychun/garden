import { handleMap } from "./clock";

interface SingleClockProps {
	shape: keyof typeof handleMap;
}

export default function SingleClock({ shape }: SingleClockProps) {
	const angles = handleMap[shape];

	return (
		<div
			className="relative h-20 w-20 border-2 border-gray-800 bg-white"
			style={
				{
					"--handle1-rotation": `${angles.handle1}deg`,
					"--handle2-rotation": `${angles.handle2}deg`,
				} as React.CSSProperties
			}
		>
			{/* Handle 1 */}
			<div
				className="absolute top-1/2 left-1/2 h-1/2 w-1 origin-top -translate-x-0.5 bg-red-500"
				style={{
					transform: `rotate(var(--handle1-rotation))`,
				}}
			/>

			{/* Handle 2 */}
			<div
				className="absolute top-1/2 left-1/2 h-1/2 w-1 origin-top -translate-x-0.5 bg-green-500"
				style={{
					transform: `rotate(var(--handle2-rotation))`,
				}}
			/>

			<div
				className="absolute top-1/2 left-1/2 h-1 w-1 origin-center -translate-x-1/2 -translate-y-1/2 bg-blue-500"
				style={{
					transform: `rotate(var(--handle1-rotation))`,
				}}
			/>
		</div>
	);
}
