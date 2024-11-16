"use client";
import { type AppRouter } from "@/server/api/root";
import useUserStore from "@/stores/user-store";
import { api } from "@/trpc/react";
import { type inferProcedureOutput } from "@trpc/server";
import React, { createContext, useContext } from "react";

interface UserProfileContextProps {
  username: string;
  isCurrentUser: boolean;
  memoryLanes: inferProcedureOutput<AppRouter["lanes"]["getAllForUsername"]>;
  isRevalidating: boolean;
  isInitialFetching: boolean;
}

const UserProfileContext = createContext<UserProfileContextProps | undefined>(
  undefined,
);

interface UserProfileProviderProps {
  username: string;
  children: React.ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
  username,
  children,
}) => {
  const { username: currentUser } = useUserStore();

  const [memoryLanes, {
    isFetching,
    isLoading,
  }] =
    api.lanes.getAllForUsername.useSuspenseQuery({
      creator: username,
    });

  return (
    <UserProfileContext.Provider
      value={{
        isCurrentUser: username === currentUser,
        memoryLanes,
        username,
        isRevalidating: isFetching,
        isInitialFetching: isLoading
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
