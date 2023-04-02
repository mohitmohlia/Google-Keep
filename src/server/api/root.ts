import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { notesRouter } from "~/server/api/routers/notes";
import { labelRouter } from "~/server/api//routers/labels";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  notes: notesRouter,
  labels: labelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
