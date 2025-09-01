import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
	loader: glob({
		pattern: "*/content.{md,mdx}",
		base: "./src/projects",
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
		disableSidebarClickOutside: z.boolean().default(false),
		floatingSidebar: z.boolean().default(false),
		widget: z
			.discriminatedUnion("type", [
				z.object({
					type: z.literal("preview"),
					config: z.object({
						bgImage: z.string(),
						previewVideo: z.string(),
						tone: z.enum(["light", "dark"]).optional(),
						id: z.string().optional(),
					}),
				}),
				z.object({
					type: z.literal("image"),
					config: z.object({
						image: z.string(),
						alt: z.string().optional(),
						height: z.union([z.string(), z.number()]).optional(),
						position: z.enum(["top", "bottom"]).optional(),
					}),
				}),
				z.object({
					type: z.literal("video"),
					config: z.object({
						video: z.string(),
						poster: z.string().optional(),
						height: z.union([z.string(), z.number()]).optional(),
						position: z.enum(["top", "bottom"]).optional(),
					}),
				}),
				z.object({
					type: z.literal("imageSwap"),
					config: z.object({
						images: z.array(z.string()),
						alt: z.string().optional(),
						height: z.union([z.string(), z.number()]).optional(),
						position: z.enum(["top", "bottom"]).optional(),
						aspect: z.enum(["portrait", "landscape", "square"]).optional(),
						intervalMs: z.number().optional(),
					}),
				}),
			])
			.optional(),
	}),
});

export const collections = { projects };
