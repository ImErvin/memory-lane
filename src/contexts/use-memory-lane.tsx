"use client";

import { type AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import { type inferProcedureOutput } from "@trpc/server";
import React, { createContext, useContext } from "react";

interface MemoryLaneContextProps {
  lane: inferProcedureOutput<AppRouter["lanes"]["getOne"]>;
  memories: inferProcedureOutput<AppRouter["memories"]["getAllForLane"]>;
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
  initialLane: inferProcedureOutput<AppRouter["lanes"]["getOne"]>;
  initialMemories: inferProcedureOutput<AppRouter["memories"]["getAllForLane"]>;
  children: React.ReactNode;
}

export const MemoryLaneProvider: React.FC<MemoryLaneProviderProps> = ({
  laneId,
  initialLane,
  initialMemories,
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
  } = api.memories.getAllForLane.useQuery(
    { laneId },
    {
      initialData: initialMemories,
      enabled: !!initialMemories,
    },
  );

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
