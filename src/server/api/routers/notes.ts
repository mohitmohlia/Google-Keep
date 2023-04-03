import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const notes = await ctx.prisma.notes.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        labels: true,
      },
    });
    if (!notes) {
      throw new TRPCError({
        message: "Notes not found for the user",
        code: "NOT_FOUND",
      });
    }
    return notes;
  }),

  destroy: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation((req) => {
      const { ctx, input } = req;
      const { prisma } = ctx;
      const note = prisma.notes.delete({
        where: {
          id: input.id,
        },
      });
      return note;
    }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().min(1),
        title: z.string(),
        isPinned: z.boolean(),
        labels: z.array(z.string()).optional(),
      })
    )
    .mutation((req) => {
      const { ctx, input } = req;
      const { prisma, session } = ctx;
      const note = prisma.notes.create({
        data: {
          text: input.text,
          title: input.title,
          isPinned: input.isPinned,
          labels: {
            connect: input.labels?.map((label) => ({ id: label })),
          },
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });
      return note;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isPinned: z.boolean().optional(),
        text: z.string().optional(),
        title: z.string().optional(),
      })
    )
    .mutation((req) => {
      const { ctx, input } = req;
      const { prisma } = ctx;
      const note = prisma.notes.update({
        data: input,
        where: {
          id: input.id,
        },
      });
      return note;
    }),
});
