import { useState } from "react";
import Digit from "./digit";

export default function Counter() {
	const [count, setCount] = useState(0);

	const increment = () => {
		setCount((prev) => Math.min(prev + 1, 999));
	};

	const decrement = () => {
		setCount((prev) => Math.max(prev - 1, 0));
	};

	const reset = () => {
		setCount(0);
	};

	// Pad the count to 3 digits
	const paddedCount = count.toString().padStart(3, "0");
	const digits = paddedCount.split("");

	return (
		<div className="flex flex-col gap-6">
			<div className="flex justify-center gap-4">
				{digits.map((digit, index) => (
					<div key={index} className="w-24">
						<Digit digit={digit as keyof typeof import("./clock").digitMap} />
					</div>
				))}
			</div>
			<div className="flex justify-center gap-2">
				<button
					className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
					onClick={increment}
				>
					Increment
				</button>
				<button
					className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
					onClick={decrement}
				>
					Decrement
				</button>
				<button
					className="rounded bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600"
					onClick={reset}
				>
					Reset
				</button>
			</div>
		</div>
	);
}
