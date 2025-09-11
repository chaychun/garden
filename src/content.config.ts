import { widgetSchema } from "@/lib/widgets-schema";
import { file, glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const baseSchema = z.object({
	types: z
		.array(z.enum(["interaction", "experiment", "design"]).readonly())
		.default(["interaction"]),
	title: z.string(),
	description: z.string(),
	createdDate: z.coerce.date(),
	lastUpdatedDate: z.coerce.date(),
	widget: widgetSchema,
});

const projects = defineCollection({
	loader: glob({
		pattern: "*/content.{md,mdx}",
		base: "./src/projects",
		generateId: ({ entry }) => entry.split("/")[0],
	}),
	schema: baseSchema,
});

const externalProjects = defineCollection({
	loader: file("./src/projects/external-projects.json", {
		parser: (text) => JSON.parse(text),
	}),
	schema: baseSchema.extend({ externalUrl: z.string().url() }),
});

export const collections = { projects, externalProjects };
