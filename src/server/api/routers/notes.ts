import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const notesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.notes.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
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
  //   create: protectedProcedure
  //     .input(z.object({ text: z.string() }))
  //     .mutation(({ ctx, input }) => {
  //       const { prisma, session } = ctx;
  //       const { text } = input;
  //       const userId = session.user.id;
  //       return prisma.notes.create({
  //         data: {
  //           text,
  //           user: {
  //             connect: {
  //               id: userId,
  //             },
  //           },
  //         },
  //       });
  //     }),
  //   getAllNotes: protectedProcedure.query(async ({ ctx, input }) => {
  //     console.log(ctx, input);
  //     const { prisma, session } = ctx;
  //     const notes = await prisma.notes.findMany({
  //       where: {
  //         id: session.user.id,
  //       },
  //     });
  //     console.log("BE", notes);
  //     return notes;
  //   }),
});
