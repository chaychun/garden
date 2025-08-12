// Centralized content type definitions, labels, URL values, and counts

export type ContentTypeId = "interaction" | "experiment" | "design";

export interface ContentTypeDefinition {
	id: ContentTypeId;
	labelSingular: string;
	labelPlural: string;
	urlFilterValue: string;
}

export const CONTENT_TYPES: readonly ContentTypeDefinition[] = [
	{
		id: "interaction",
		labelSingular: "Interaction",
		labelPlural: "Interactions",
		urlFilterValue: "interactions",
	},
	{
		id: "experiment",
		labelSingular: "Experiment",
		labelPlural: "Experiments",
		urlFilterValue: "experiments",
	},
	{
		id: "design",
		labelSingular: "Design",
		labelPlural: "Designs",
		urlFilterValue: "designs",
	},
];

export const CONTENT_TYPE_IDS: ContentTypeId[] = CONTENT_TYPES.map((d) => d.id);

const idToDefinition = new Map<ContentTypeId, ContentTypeDefinition>(
	CONTENT_TYPES.map((d) => [d.id, d]),
);

const urlFilterToDefinition = new Map<string, ContentTypeDefinition>(
	CONTENT_TYPES.map((d) => [d.urlFilterValue, d]),
);

export type FilterType = "All" | (typeof CONTENT_TYPES)[number]["labelPlural"];

export const AVAILABLE_FILTERS: readonly FilterType[] = [
	"All",
	...CONTENT_TYPES.map((d) => d.labelPlural),
] as const;

export function getDefinitionById(id: ContentTypeId): ContentTypeDefinition {
	const def = idToDefinition.get(id);
	if (!def) {
		throw new Error(`Unknown content type id: ${id}`);
	}
	return def;
}

export function typeIdToUrlFilterValue(id: ContentTypeId): string {
	return getDefinitionById(id).urlFilterValue;
}

export function toUrlFilterValue(filter: FilterType): string {
	if (filter === "All") return "all";
	const match = CONTENT_TYPES.find((d) => d.labelPlural === filter);
	return match ? match.urlFilterValue : "all";
}

export function filterFromUrlValue(
	urlValue: string | null | undefined,
): FilterType {
	if (!urlValue || urlValue === "all") return "All";
	const def = urlFilterToDefinition.get(urlValue.toLowerCase());
	return def ? (def.labelPlural as FilterType) : "All";
}

export function urlFilterValueToTypeId(
	urlValue: string,
): ContentTypeId | undefined {
	const def = urlFilterToDefinition.get(urlValue.toLowerCase());
	return def?.id;
}

// Counts for filters used in the UI
type WorkModule = { frontmatter?: { types?: ContentTypeId[] } };

const workModules = import.meta.glob("../works/*/*.{md,mdx}", { eager: true });
const workEntries = Object.values(workModules) as WorkModule[];

function countByTypeId(id: ContentTypeId): number {
	// for backward compatibility
	const fallbackTypes: ContentTypeId[] = ["interaction"];
	return workEntries.filter((m) =>
		(m.frontmatter?.types ?? fallbackTypes).includes(id),
	).length;
}

const countsByLabelPlural = new Map<FilterType, number>();
for (const def of CONTENT_TYPES) {
	countsByLabelPlural.set(def.labelPlural as FilterType, countByTypeId(def.id));
}

const totalCount = workEntries.length;

export const filterCounts: Record<FilterType, number> = {
	All: totalCount,
	...Object.fromEntries(countsByLabelPlural.entries()),
} as const;

// End counts
