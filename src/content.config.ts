import { file, glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const backgroundFields = {
	bgImage: z.string().optional(),
	bgFillClass: z.string().optional(),
};

function withBackground<T extends z.ZodRawShape>(shape: T) {
	return z
		.object({
			...backgroundFields,
			...shape,
		})
		.superRefine((v, ctx) => {
			if (!v.bgImage && !v.bgFillClass) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "Provide bgImage or bgFillClass",
					path: ["bgImage"],
				});
			}
		});
}

const widgetSchema = z
	.discriminatedUnion("type", [
		z.object({
			type: z.literal("image"),
			config: withBackground({
				previewImage: z.string(),
				alt: z.string().optional(),
				previewWidth: z.number().min(0).max(1).optional(),
			}),
		}),
		z.object({
			type: z.literal("video"),
			config: withBackground({
				previewVideo: z.string(),
				previewWidth: z.number().min(0).max(1).optional(),
			}),
		}),
		z.object({
			type: z.literal("image-swap"),
			config: withBackground({
				previewImages: z.array(z.string()),
				alt: z.string().optional(),
				aspect: z.enum(["portrait", "landscape", "square"]).optional(),
				intervalMs: z.number().optional(),
				previewWidth: z.number().min(0).max(1).optional(),
			}),
		}),
	])
	.optional();

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
