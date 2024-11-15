import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const memoriesRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        username: z.string().optional(),
        orderBy: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.db.memories) {
        throw new Error("Database connection error");
      }

      const memories = await ctx.db.memories.findMany({
        orderBy: { timestamp: input.orderBy },
        where: {
          username: input.username,
        },
      });

      return memories ?? [];
    }),
  createOne: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        timestamp: z.string().optional(),
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db.memories) {
        throw new Error("Database connection error");
      }

      const memory = await ctx.db.memories.create({
        data: {
          name: input.name,
          description: input.description,
          timestamp: input.timestamp,
          username: input.username,
        },
      });

      return memory;
    }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.db.memories) {
        throw new Error("Database connection error");
      }

      const memory = await ctx.db.memories.findUnique({
        where: {
          id: input.id,
        },
      });

      return memory;
    }),
  updateOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        timestamp: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db.memories) {
        throw new Error("Database connection error");
      }

      const memory = await ctx.db.memories.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          timestamp: input.timestamp,
        },
      });

      return memory;
    }),
  deleteOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db.memories) {
        throw new Error("Database connection error");
      }

      const memory = await ctx.db.memories.delete({
        where: {
          id: input.id,
        },
      });

      return memory;
    }),
});
