import type { Loader } from "astro/loaders";
import { z } from "astro:content";
import matter from "gray-matter";
import { promises as fs } from "node:fs";
import { relative as pathRelative } from "node:path";
import { fileURLToPath } from "node:url";
import { glob as tinyglobby } from "tinyglobby";

// Use gray-matter to split and parse frontmatter robustly
function extract(contents: string): {
	data: Record<string, unknown>;
	content: string;
} {
	const { data, content } = matter(contents);
	return { data: (data as Record<string, unknown>) ?? {}, content };
}

export default function canonicalWorksLoader(): Loader {
	return {
		name: "canonical-works-loader",
		async load({
			config,
			logger,
			parseData,
			store,
			generateDigest,
			renderMarkdown,
		}) {
			store.clear();

			const worksDir = new URL("src/works/", config.root);
			const worksFsPath = fileURLToPath(worksDir);

			let files: string[] = [];
			try {
				files = await tinyglobby(["*/*.md", "*/*.mdx"], {
					cwd: worksFsPath,
					expandDirectories: false,
				});
			} catch {
				logger.warn(`Cannot glob works in ${worksFsPath}`);
				return;
			}

			const canonicalFiles = files.filter((relPath) => {
				const parts = relPath.split("/");
				if (parts.length !== 2) return false;
				const folder = parts[0];
				const fileWithExt = parts[1];
				const file = fileWithExt.replace(/\.(md|mdx)$/i, "");
				return folder === file;
			});

			for (const relPath of canonicalFiles) {
				const fileUrl = new URL(relPath, worksDir);

				let contents: string | undefined;
				try {
					contents = await fs.readFile(fileUrl, "utf8");
				} catch {
					logger.warn(`Failed to read ${fileURLToPath(fileUrl)}`);
					continue;
				}
				if (contents == null) continue;

				const { data: fmParsed, content } = extract(contents);

				const folder = relPath.split("/")[0];
				const id = folder;
				const filePath = pathRelative(
					fileURLToPath(config.root),
					fileURLToPath(fileUrl),
				);

				let rendered: any | undefined = undefined;
				let frontmatter: Record<string, unknown> = fmParsed;
				try {
					rendered = await renderMarkdown(content);
					const fm = (rendered?.metadata?.frontmatter ?? {}) as Record<
						string,
						unknown
					>;
					if (fm && Object.keys(fm).length > 0) {
						frontmatter = fm;
					}
				} catch {
					// keep fmParsed
				}

				const parsedData = await parseData({ id, data: frontmatter, filePath });
				const digest = generateDigest(contents);

				store.set({
					id,
					data: parsedData,
					body: undefined,
					filePath,
					digest,
					rendered,
					assetImports: rendered?.metadata?.imagePaths,
				});
			}
		},
		// Provide the schema through the loader
		async schema() {
			return z.object({
				types: z
					.array(
						z.enum(["interaction", "experiment", "design"]).readonly() as any,
					)
					.default(["interaction"]),
				title: z.string(),
				description: z.string(),
				createdDate: z.coerce.date(),
				lastUpdatedDate: z.coerce.date(),
				bgImage: z.string(),
				previewVideo: z.string(),
				orientation: z.enum(["portrait", "landscape"]).default("portrait"),
				position: z.enum(["top", "bottom"]).default("top"),
				badgeVariant: z.enum(["light", "dark"]).default("light"),
				disableSidebarClickOutside: z.boolean().default(false),
			});
		},
	};
}
