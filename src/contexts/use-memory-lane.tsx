"use client";

import { type appRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import { type inferProcedureOutput } from "@trpc/server";
import React, { createContext, useContext, useState, useEffect } from "react";

interface MemoryLaneContextProps {
  lane: inferProcedureOutput<(typeof appRouter)["lanes"]["getOne"]>;
  memories: inferProcedureOutput<
    (typeof appRouter)["memories"]["getAllForLane"]
  >;
  isInitialFetchingLane: boolean;
  isInitialFetchingMemories: boolean;
  isRevalidatingLane: boolean;
  isRevalidatingMemories: boolean;
  refetchLane: ReturnType<typeof api.lanes.getOne.useQuery>["refetch"];
  refetchMemories: ReturnType<
    typeof api.memories.getAllForLane.useQuery
  >["refetch"];
}

const MemoryLaneContext = createContext<MemoryLaneContextProps | undefined>(
  undefined,
);

interface MemoryLaneProviderProps {
  laneId: number;
  initialLane: inferProcedureOutput<(typeof appRouter)["lanes"]["getOne"]>;
  children: React.ReactNode;
}

export const MemoryLaneProvider: React.FC<MemoryLaneProviderProps> = ({
  laneId,
  initialLane,
  children,
}) => {
  const {
    data: lane,
    isFetching,
    isLoading,
    refetch: refetchLane,
  } = api.lanes.getOne.useQuery(
    { id: laneId },
    {
      initialData: initialLane,
      enabled: !!initialLane,
    },
  );

  const {
    data: memories = [],
    isFetching: isMemoriesFetching,
    isLoading: isMemoriesLoading,
    refetch: refetchMemories,
  } = api.memories.getAllForLane.useQuery({ laneId });

  return (
    <MemoryLaneContext.Provider
      value={{
        lane,
        memories,
        isInitialFetchingLane: isLoading,
        isInitialFetchingMemories: isMemoriesLoading,
        isRevalidatingLane: isFetching,
        isRevalidatingMemories: isMemoriesFetching,
        refetchLane,
        refetchMemories,
      }}
    >
      {children}
    </MemoryLaneContext.Provider>
  );
};

export const useMemoryLane = (): MemoryLaneContextProps => {
  const context = useContext(MemoryLaneContext);
  if (context === undefined) {
    throw new Error("useMemoryLane must be used within a MemoryLaneProvider");
  }
  return context;
};
