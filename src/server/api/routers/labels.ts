import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const labelRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;
    const labels = await prisma.labels.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!labels) {
      throw new TRPCError({
        message: "labels not found",
        code: "NOT_FOUND",
      });
    }
    return labels;
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const label = await prisma.labels.create({
        data: {
          name: input.name,
        },
      });
      if (!label) {
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return label;
    }),
  update: protectedProcedure
    .input(z.object({ name: z.string().min(1), id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const label = await prisma.labels.update({
        data: {
          name: input.name,
        },
        where: {
          id: input.id,
        },
      });
      if (!label) {
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return label;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const label = await prisma.labels.delete({
        where: {
          id: input.id,
        },
      });
      if (!label) {
        throw new TRPCError({
          message: "Something went wrong",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return label;
    }),
});
