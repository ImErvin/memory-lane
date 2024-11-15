import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { DbConnectionError } from "../exceptions";

const laneInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  creator: z.string(),
});

const laneUpdateSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  creator: z.string(),
});

export const lanesRouter = createTRPCRouter({
  createOne: publicProcedure
    .input(laneInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db.lane) throw new DbConnectionError();

      const lane = await ctx.db.lane.create({
        data: {
          name: input.name,
          description: input.description,
          creator: input.creator,
        },
      });

      return lane;
    }),

  getOne: publicProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
    if (!ctx.db.lane) throw new DbConnectionError();

    const lane = await ctx.db.lane.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!lane) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "The lane you are trying to access does not exist",
      });
    }

    return lane;
  }),

  getAllForUsername: publicProcedure
    .input(z.object({ creator: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.db.lane) throw new DbConnectionError();

      const lanes = await ctx.db.lane.findMany({
        where: {
          creator: input.creator,
        },
      });

      return lanes;
    }),

  updateOne: publicProcedure
    .input(laneUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db.lane) throw new DbConnectionError();

      const existingLane = await ctx.db.lane.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingLane) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are trying to update a lane that does not exist",
        });
      }

      if (existingLane.creator !== input.creator) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are not the creator of this lane, so you cannot update it",
        });
      }

      const updatedLane = await ctx.db.lane.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name ?? existingLane.name,
          description: input.description ?? existingLane.description,
        },
      });

      return updatedLane;
    }),

  deleteOne: publicProcedure
    .input(z.object({ id: z.number(), creator: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db.lane) throw new DbConnectionError();

      const existingLane = await ctx.db.lane.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingLane) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are trying to delete a lane that does not exist",
        });
      }

      if (existingLane.creator !== input.creator) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message:
            "You are not the creator of this lane, so you cannot delete it",
        });
      }

      const deletedLane = await ctx.db.lane.delete({
        where: {
          id: input.id,
        },
      });

      return deletedLane;
    }),
});
