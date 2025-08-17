import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const day = date.getDate();
	const month = date.toLocaleDateString("en-US", { month: "short" });
	const year = date.getFullYear();

	return `${month} ${day}, ${year}`;
}

// Converts a ratio/number/CSS value into a CSS height string.
// - undefined -> "66.6667%" (2/3)
// - number <= 1 -> percentage (e.g., 0.75 -> "75%")
// - number > 1 -> pixels (e.g., 420 -> "420px")
// - "a/b" ratio -> percentage (e.g., "2/3" -> "66.6667%")
// - otherwise, returns the input as-is
export function toCssHeight(value?: string | number): string {
	if (value === undefined) return `${((2 / 3) * 100).toFixed(4)}%`;
	if (typeof value === "number") {
		return value <= 1 ? `${(value * 100).toFixed(4)}%` : `${value}px`;
	}
	const trimmed = value.trim();
	const ratioMatch = /^(\d+)\s*\/\s*(\d+)$/.exec(trimmed);
	if (ratioMatch) {
		const numerator = Number(ratioMatch[1]);
		const denominator = Number(ratioMatch[2]) || 1;
		return `${((numerator / denominator) * 100).toFixed(4)}%`;
	}
	return trimmed;
}
