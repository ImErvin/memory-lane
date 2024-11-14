import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        orderBy: z.enum(["asc", "desc"]).default("desc"),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.db.memories) {
        throw new Error("Database connection error");
      }

      const memories = await ctx.db.memories.findMany({
        orderBy: { timeStamp: input.orderBy },
      });

      return memories ?? [];
    }),
});
