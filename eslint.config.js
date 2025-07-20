import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginAstro from "eslint-plugin-astro";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
	...eslintPluginAstro.configs.recommended,
	eslintConfigPrettier,
	{
		files: ["**/*.{ts,tsx}"],
		ignores: [".vercel/**", "dist/**", "build/**"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			"react-compiler": reactCompiler,
			"react-hooks": reactHooks,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			...reactCompiler.configs.recommended.rules,
		},
	},
]);
