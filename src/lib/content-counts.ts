const articleModules = import.meta.glob("../contents/articles/**/*.{md,mdx}");
const interactionModules = import.meta.glob(
	"../contents/interactions/**/*.{md,mdx}",
);

export const articleCount = Object.keys(articleModules).length;
export const interactionCount = Object.keys(interactionModules).length;
export const totalCount = articleCount + interactionCount;

export const filterCounts = {
	All: totalCount,
	Interactions: interactionCount,
	Articles: articleCount,
} as const;
