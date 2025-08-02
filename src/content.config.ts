import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const articles = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/contents/articles" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		tags: z.string().array().optional(),
		coverImage: z.string().optional(),
		previewImage: z.string().optional(),
		growthStage: z.enum(["Seedling", "Budding", "Evergreen"]).optional(),
		position: z.enum(["top", "bottom"]).default("top"),
	}),
});

const interactions = defineCollection({
	loader: glob({
		pattern: "*/*.{md,mdx}",
		base: "./src/interactions",
		generateId: ({ entry }) => entry.split("/")[0],
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		createdDate: z.coerce.date(),
		lastUpdatedDate: z.coerce.date(),
		tags: z.string().array().optional(),
		coverImage: z.string().optional(),
		previewImage: z.string().optional(),
		bgImage: z.string().optional(),
		orientation: z.enum(["portrait", "landscape"]).default("portrait"),
		position: z.enum(["top", "bottom"]).default("top"),
	}),
});

export const collections = { articles, interactions };
