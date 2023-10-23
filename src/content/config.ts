import { defineCollection, z } from "astro:content";

export const collections = {
  pages: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      datePublished: z.date(),
      dateModified: z.date().optional(),
    }),
  }),
};
