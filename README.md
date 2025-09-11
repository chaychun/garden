## Garden

Personal portfolio/playground. Each project is an experiment in web design and interaction. Many projects include interactive components users can play with.

## Stack

- Astro for pages/layouts and content collections
- React for interactive UI
- Tailwind CSS for styling
- GSAP for timeline/scroll smoothing in `.astro` scripts
- Motion for React animations
- TypeScript, pnpm, Prettier, ESLint

## Quick start

```sh
pnpm install
pnpm dev
```

Build and preview:

```sh
pnpm build
pnpm preview
```

## Project structure

- `src/pages/`: routes kept minimal
- `src/layouts/`: page shells (`BaseLayout.astro`, `HomeLayout.astro`, `ProjectLayout.astro`) control header and scroll behavior
- `src/components/`: reusable UI (Astro or React). React components live in `*.tsx` and are hydrated via client directives from `.astro` parents
- `src/projects/[project]/`: one folder per project with content and optional interactive view
- `src/lib/`: shared logic (`content-types.ts`, `widgets-schema.ts`, `scroll-smoothing.ts`, stores, utils)
- `src/styles/global.css`: Tailwind setup and theme tokens
- `public/`: static assets

## Content model

Collections are defined in `src/content.config.ts`:

- `projects`: MD/MDX under `src/projects/*/content.mdx`
- `externalProjects`: `src/projects/external-projects.json`

Base fields:

- `types`: `interaction | experiment | design` (array)
- `title`, `description`
- `createdDate`, `lastUpdatedDate`
- `widget`: discriminated union defined in `src/lib/widgets-schema.ts`

Widgets:

- `image`: `previewImage`, optional `alt`, `previewWidth`, plus background
- `video`: `previewVideo`, optional `previewWidth`, plus background
- `image-swap`: `previewImages[]`, optional `alt`, `aspect`, `intervalMs`, `previewWidth`, plus background
- Background requires one of `bgImage` or `bgFillClass`

Filtering is centralized in `src/lib/content-types.ts` with URL sync via `?filter=`.

## Adding a new project

1. Create `src/projects/[project]/`
2. Add `content.mdx` with frontmatter using the shared schema, including `types` and `widget`
3. Add `[project].astro` for an interactive view if needed; keep it self-contained and import only project-scoped pieces and safe shared libs
4. If you add new content fields or a widget type, update `content.config.ts` and/or `src/lib/widgets-schema.ts`, then run:

```sh
pnpm astro sync
```

## Scroll behavior

- Horizontal on desktop, vertical on mobile
- Layouts call helpers from `src/lib/scroll-smoothing.ts` in client `<script>` blocks

## Conventions

- Keep pages thin; push logic into layouts/components
- Use Tailwind utilities; avoid ad-hoc CSS
- Prefer small React components; minimize `useEffect`
- Server-only imports like `astro:content` stay in `.astro` frontmatter, not React

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm preview`
- `pnpm astro` (CLI)
- `pnpm check` (Astro Check)
- `pnpm lint` (ESLint)
- `pnpm format` (Prettier)
