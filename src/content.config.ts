import canonicalWorksLoader from "@/lib/loaders/canonical-works-loader";
import { defineCollection } from "astro:content";

const works = defineCollection({ loader: canonicalWorksLoader() });

export const collections = { works };
