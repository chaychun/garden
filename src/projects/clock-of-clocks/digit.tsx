import { digitMap, handleMap } from "./clock";
import SingleClock from "./single-clock";

interface DigitProps {
	digit: keyof typeof digitMap;
	className?: string;
}

export default function Digit({ digit, className = "" }: DigitProps) {
	const grid = digitMap[digit];

	return (
		<div className={`grid grid-cols-4 grid-rows-6 gap-1 ${className}`}>
			{grid.map((row, rowIndex) =>
				row.map((shape, colIndex) => (
					<SingleClock
						key={`${rowIndex}-${colIndex}`}
						shape={shape as keyof typeof handleMap}
					/>
				)),
			)}
		</div>
	);
}
