import { useEffect, useState } from "react";
import { digitMap, formatTimeToDigits, getGMTPlus7Time } from "./clock";
import Digit from "./digit";

type DigitKey = keyof typeof digitMap;

export default function BigClock() {
	const [timeDigits, setTimeDigits] = useState<string[]>([]);

	useEffect(() => {
		const updateTime = () => {
			const gmtPlus7Time = getGMTPlus7Time();
			const digits = formatTimeToDigits(gmtPlus7Time);
			setTimeDigits(digits);
		};

		updateTime();

		const interval = setInterval(updateTime, 1000);

		return () => clearInterval(interval);
	}, []);

	if (timeDigits.length === 0) {
		return (
			<div className="flex h-32 items-center justify-center">
				<div className="text-gray-500">Loading...</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex items-center gap-2">
				<div className="flex gap-1">
					<div className="w-16">
						<Digit digit={timeDigits[0] as DigitKey} />
					</div>
					<div className="w-16">
						<Digit digit={timeDigits[1] as DigitKey} />
					</div>
				</div>
				<div className="mx-2 flex flex-col gap-1">
					<div className="h-2 w-2 rounded-full bg-gray-800"></div>
					<div className="h-2 w-2 rounded-full bg-gray-800"></div>
				</div>
				<div className="flex gap-1">
					<div className="w-16">
						<Digit digit={timeDigits[2] as DigitKey} />
					</div>
					<div className="w-16">
						<Digit digit={timeDigits[3] as DigitKey} />
					</div>
				</div>
				<div className="mx-2 flex flex-col gap-1">
					<div className="h-2 w-2 rounded-full bg-gray-800"></div>
					<div className="h-2 w-2 rounded-full bg-gray-800"></div>
				</div>
				<div className="flex gap-1">
					<div className="w-16">
						<Digit digit={timeDigits[4] as DigitKey} />
					</div>
					<div className="w-16">
						<Digit digit={timeDigits[5] as DigitKey} />
					</div>
				</div>
			</div>
			<div className="font-mono text-sm text-gray-600">GMT+7</div>
		</div>
	);
}
