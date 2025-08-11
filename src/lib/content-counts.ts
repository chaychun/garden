const workModules = import.meta.glob("../works/*/*.{md,mdx}", { eager: true });

type WorkModule = { frontmatter?: { types?: string[] } };

const workEntries = Object.values(workModules) as WorkModule[];
const interactionCount = workEntries.filter((m) =>
	(m.frontmatter?.types ?? ["interaction"]).includes("interaction"),
).length;
const totalCount = interactionCount;

export const filterCounts = {
	All: totalCount,
	Interactions: interactionCount,
} as const;
