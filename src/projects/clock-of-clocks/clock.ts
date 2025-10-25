export const handleMap = {
	tl: { handle1: 270, handle2: 0 },
	tr: { handle1: 90, handle2: 0 },
	bl: { handle1: 270, handle2: 180 },
	br: { handle1: 90, handle2: 180 },
	v: { handle1: 180, handle2: 0 },
	h: { handle1: 270, handle2: 90 },
	i: { handle1: 45, handle2: 45 },
};

export const digitMap = {
	"0": [
		["tl", "h", "h", "tr"],
		["v", "tl", "tr", "v"],
		["v", "v", "v", "v"],
		["v", "v", "v", "v"],
		["v", "bl", "br", "v"],
		["bl", "h", "h", "br"],
	],
	"1": [
		["i", "i", "tl", "tr"],
		["i", "i", "v", "v"],
		["i", "i", "v", "v"],
		["i", "i", "v", "v"],
		["i", "i", "v", "v"],
		["i", "i", "bl", "br"],
	],
	"2": [
		["tl", "h", "h", "tr"],
		["bl", "h", "tr", "v"],
		["tl", "h", "br", "v"],
		["v", "tl", "h", "br"],
		["v", "bl", "h", "tr"],
		["bl", "h", "h", "br"],
	],
	"3": [
		["tl", "h", "h", "tr"],
		["bl", "h", "tr", "v"],
		["tl", "h", "br", "v"],
		["bl", "h", "tr", "v"],
		["tl", "h", "br", "v"],
		["bl", "h", "h", "br"],
	],
	"4": [
		["tl", "tr", "tl", "tr"],
		["v", "v", "v", "v"],
		["v", "bl", "br", "v"],
		["bl", "h", "tr", "v"],
		["i", "i", "v", "v"],
		["i", "i", "bl", "br"],
	],
	"5": [
		["tl", "h", "h", "tr"],
		["v", "tl", "h", "br"],
		["v", "bl", "h", "tr"],
		["bl", "h", "tr", "v"],
		["tl", "h", "br", "v"],
		["bl", "h", "h", "br"],
	],
	"6": [
		["tl", "h", "h", "tr"],
		["v", "tl", "h", "br"],
		["v", "bl", "h", "tr"],
		["v", "tl", "tr", "v"],
		["v", "bl", "br", "v"],
		["bl", "h", "h", "br"],
	],
	"7": [
		["tl", "h", "h", "tr"],
		["bl", "h", "tr", "v"],
		["i", "i", "v", "v"],
		["i", "i", "v", "v"],
		["i", "i", "v", "v"],
		["i", "i", "bl", "br"],
	],
	"8": [
		["tl", "h", "h", "tr"],
		["v", "tl", "tr", "v"],
		["v", "bl", "br", "v"],
		["v", "tl", "tr", "v"],
		["v", "bl", "br", "v"],
		["bl", "h", "h", "br"],
	],
	"9": [
		["tl", "h", "h", "tr"],
		["v", "tl", "tr", "v"],
		["v", "bl", "br", "v"],
		["bl", "h", "tr", "v"],
		["tl", "h", "br", "v"],
		["bl", "h", "h", "br"],
	],
};

export function getGMTPlus7Time(): Date {
	const now = new Date();
	const gmtPlus7 = new Date(now.getTime() + 7 * 60 * 60 * 1000);
	return gmtPlus7;
}

export function formatTimeToDigits(date: Date): string[] {
	const hours = date.getUTCHours().toString().padStart(2, "0");
	const minutes = date.getUTCMinutes().toString().padStart(2, "0");
	const seconds = date.getUTCSeconds().toString().padStart(2, "0");

	return [hours[0], hours[1], minutes[0], minutes[1], seconds[0], seconds[1]];
}
