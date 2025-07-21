// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import vtbot from "astro-vtbot";

// https://astro.build/config
export default defineConfig({
    integrations: [react({
        babel: {
            plugins: [["babel-plugin-react-compiler"]],
        },
		}), vtbot()],

    vite: {
        plugins: [tailwindcss()],
    },

    experimental: {
        fonts: [
            {
                provider: fontProviders.fontshare(),
                name: "Switzer",
                cssVariable: "--font-switzer",
                weights: ["100 900"],
                styles: ["normal", "italic"],
                subsets: ["latin"],
                fallbacks: ["system-ui", "sans-serif"],
            },
            {
                provider: fontProviders.fontshare(),
                name: "Cabinet Grotesk",
                cssVariable: "--font-cabinet",
                weights: ["100 900"],
                styles: ["normal", "italic"],
                subsets: ["latin"],
                fallbacks: ["system-ui", "sans-serif"],
            },
            {
                provider: fontProviders.fontshare(),
                name: "Share Tech Mono",
                cssVariable: "--font-tabular",
                weights: ["400"],
                styles: ["normal"],
                subsets: ["latin"],
                fallbacks: ["monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "Courier New"],
            },
        ],
    },
});