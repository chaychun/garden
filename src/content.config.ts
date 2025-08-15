import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const works = defineCollection({
	loader: glob({
		pattern: "*/content.{md,mdx}",
		base: "./src/works",
		generateId: ({ entry }) => entry.split("/")[0],
	}),
	schema: z.object({
		types: z
			.array(z.enum(["interaction", "experiment", "design"]).readonly())
			.default(["interaction"]),
		title: z.string(),
		description: z.string(),
		createdDate: z.coerce.date(),
		lastUpdatedDate: z.coerce.date(),
		bgImage: z.string(),
		previewVideo: z.string(),
		tone: z.enum(["light", "dark"]).default("light"),
		disableSidebarClickOutside: z.boolean().default(false),
	}),
});

export const collections = { works };
