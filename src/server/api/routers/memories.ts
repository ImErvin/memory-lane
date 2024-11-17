import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { DbConnectionError } from "../exceptions";

const memoryInputSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  timestamp: z.string().optional(),
  laneId: z.number(),
  creator: z.string(),
  images: z
    .array(z.string().url())
    .min(1, "At least one image URL is required")
    .max(1, "Maximum of 1 image URLs allowed"),
});

const memoryUpdateSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  timestamp: z.string().optional(),
  creator: z.string(),
  images: z.array(z.string().url()).optional(),
});

export const memoriesRouter = createTRPCRouter({
  createOne: publicProcedure
    .input(memoryInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db.memory) throw new DbConnectionError();

      const lane = await ctx.db.lane.findUnique({
        where: { id: input.laneId },
      });

      if (!lane) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lane not found" });
      }

      if (lane.creator !== input.creator) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not the creator of the lane",
        });
      }

      const memory = await ctx.db.memory.create({
        data: {
          name: input.name,
          description: input.description,
          timestamp: input.timestamp ? new Date(input.timestamp) : undefined,
          laneId: input.laneId,
          images: {
            // Currently only allowing 1 image upload on the FE and zod
            // but can be extended to allow multiple images later
            create: input.images.map((url) => ({
              url,
              uploader: input.creator,
            })),
          },
        },
        include: {
          images: true,
        },
      });

      return memory;
    }),

  getOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
        creator: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.db.memory) throw new DbConnectionError();

      const memory = await ctx.db.memory.findUnique({
        where: { id: input.id },
        include: {
          images: true,
          lane: {
            select: {
              creator: true,
              name: true,
              createdAt: true,
              id: true,
            },
          },
        },
      });

      if (!memory) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Memory not found" });
      }

      return memory;
    }),

  updateOne: publicProcedure
    .input(memoryUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db.memory) throw new DbConnectionError();

      const existingMemory = await ctx.db.memory.findUnique({
        where: { id: input.id },
        include: {
          lane: {
            select: { creator: true },
          },
        },
      });

      if (!existingMemory) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Memory not found" });
      }

      if (existingMemory.lane.creator !== input.creator) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not the creator of the lane",
        });
      }

      const updatedMemory = await ctx.db.memory.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          timestamp: input.timestamp ? new Date(input.timestamp) : undefined,
          images: input.images
            ? {
                deleteMany: {},
                create: input.images.map((url) => ({
                  url,
                  uploader: input.creator,
                })),
              }
            : undefined,
        },
        include: {
          images: true,
        },
      });

      return updatedMemory;
    }),

  deleteOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
        creator: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.db.memory) throw new DbConnectionError();

      const existingMemory = await ctx.db.memory.findUnique({
        where: { id: input.id },
        include: {
          lane: {
            select: { creator: true },
          },
        },
      });

      if (!existingMemory) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Memory not found" });
      }

      if (existingMemory.lane.creator !== input.creator) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User is not the creator of the lane",
        });
      }

      const memory = await ctx.db.memory.delete({
        where: { id: input.id },
      });

      return memory;
    }),

  getAllForLane: publicProcedure
    .input(
      z.object({
        laneId: z.number(),
        orderBy: z.enum(["asc", "desc"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.db.memory) throw new DbConnectionError();

      const memories = await ctx.db.memory.findMany({
        where: { laneId: input.laneId },
        orderBy: {
          timestamp: input.orderBy ?? "desc",
        },
        include: {
          images: true,
        },
      });

      return memories;
    }),
});
