import { TRPCError } from "@trpc/server";

export const DbConnectionError = class DbConnectionError extends TRPCError {
  constructor() {
    super({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database connection error",
    });
  }
};
