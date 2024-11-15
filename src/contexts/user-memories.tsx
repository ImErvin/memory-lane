"use client";

import { type AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import { type inferProcedureOutput } from "@trpc/server";
import React, { createContext, useContext, type ReactNode } from "react";

type MemoryArray = inferProcedureOutput<AppRouter["memories"]["getAll"]>;

interface UserMemoriesContextProps {
  orderBy: "asc" | "desc";
  setOrderBy: (value: "asc" | "desc") => void;
  memories: MemoryArray | undefined;
  username: string;
  isLoading: boolean;
}

const UserMemoriesContext = createContext<UserMemoriesContextProps | undefined>(
  undefined,
);

export const useUserMemories = () => {
  const context = useContext(UserMemoriesContext);
  if (!context) {
    throw new Error(
      "useUserMemories must be used within a UserMemoriesProvider",
    );
  }
  return context;
};

interface UserMemoriesProviderProps {
  children: ReactNode;
  username: string;
}

export const UserMemoriesProvider: React.FC<UserMemoriesProviderProps> = (
  props,
) => {
  const { children, username } = props;
  const [orderBy, setOrderBy] = React.useState<"asc" | "desc">("desc");

  const { data: memories, isLoading } = api.memories.getAll.useQuery({
    orderBy,
    username,
  });

  return (
    <UserMemoriesContext.Provider value={{ orderBy, setOrderBy, memories, username, isLoading }}>
      {children}
    </UserMemoriesContext.Provider>
  );
};
