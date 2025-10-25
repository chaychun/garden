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
		<div className="flex w-full flex-col items-center gap-4 px-8">
			<div className="flex w-full items-center justify-center gap-4">
				<div className="flex flex-1 gap-1">
					<div className="flex-1">
						<Digit digit={timeDigits[0] as DigitKey} />
					</div>
					<div className="flex-1">
						<Digit digit={timeDigits[1] as DigitKey} />
					</div>
				</div>
				<div className="flex flex-1 gap-1">
					<div className="flex-1">
						<Digit digit={timeDigits[2] as DigitKey} />
					</div>
					<div className="flex-1">
						<Digit digit={timeDigits[3] as DigitKey} />
					</div>
				</div>
				<div className="flex flex-1 gap-1">
					<div className="flex-1">
						<Digit digit={timeDigits[4] as DigitKey} />
					</div>
					<div className="flex-1">
						<Digit digit={timeDigits[5] as DigitKey} />
					</div>
				</div>
			</div>
			<div className="text-base-200 font-mono text-sm">
				Bangkok Time (GMT+7)
			</div>
		</div>
	);
}
