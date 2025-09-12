import { z } from "astro:content";

export const backgroundFields = {
	bgImage: z.string().optional(),
	bgFillClass: z.string().optional(),
};

export function withBackground<T extends z.ZodRawShape>(shape: T) {
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

export const widgetSchema = z
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
				intervalMs: z.number().min(100).optional(),
				previewWidth: z.number().min(0).max(1).optional(),
			}),
		}),
		z.object({
			type: z.literal("interactive"),
			config: withBackground({}),
		}),
	])
	.optional();

export type Aspect = "portrait" | "landscape" | "square";

export type WidgetImage = {
	type: "image";
	config: {
		bgImage?: string;
		bgFillClass?: string;
		previewImage: string;
		alt?: string;
		previewWidth?: number;
	};
};

export type WidgetVideo = {
	type: "video";
	config: {
		bgImage?: string;
		bgFillClass?: string;
		previewVideo: string;
		previewWidth?: number;
	};
};

export type WidgetImageSwap = {
	type: "image-swap";
	config: {
		bgImage?: string;
		bgFillClass?: string;
		previewImages: string[];
		alt?: string;
		aspect?: Aspect;
		intervalMs?: number;
		previewWidth?: number;
	};
};

export type WidgetInteractive = {
	type: "interactive";
	config: {
		bgImage?: string;
		bgFillClass?: string;
	};
};

export type WidgetUnion =
	| WidgetImage
	| WidgetVideo
	| WidgetImageSwap
	| WidgetInteractive;
