// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import vtbot from "astro-vtbot";

import mdx from "@astrojs/mdx";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
	integrations: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
		vtbot(),
		mdx(),
	],

	vite: {
		plugins: [tailwindcss()],
	},

	experimental: {
		fonts: [
			{
				provider: fontProviders.fontshare(),
				name: "Switzer",
				cssVariable: "--astro-font-switzer",
				weights: ["100 900"],
				styles: ["normal", "italic"],
				subsets: ["latin"],
				fallbacks: ["system-ui", "sans-serif"],
			},
			{
				provider: fontProviders.fontshare(),
				name: "Cabinet Grotesk",
				cssVariable: "--astro-font-cabinet",
				weights: ["100 900"],
				styles: ["normal", "italic"],
				subsets: ["latin"],
				fallbacks: ["system-ui", "sans-serif"],
			},
			{
				provider: fontProviders.fontshare(),
				name: "Tabular",
				cssVariable: "--astro-font-tabular",
				weights: ["300 700"],
				styles: ["normal", "italic"],
				subsets: ["latin"],
				fallbacks: [
					"monospace",
					"SFMono-Regular",
					"Menlo",
					"Consolas",
					"Liberation Mono",
					"Courier New",
				],
			},
			{
				provider: fontProviders.fontshare(),
				name: "Gambarino",
				cssVariable: "--astro-font-gambarino",
				weights: ["100 900"],
				styles: ["normal", "italic"],
				subsets: ["latin"],
				fallbacks: ["system-ui", "sans-serif"],
			},
		],
	},

	adapter: vercel(),
});
