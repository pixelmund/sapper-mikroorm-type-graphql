import type { AuthChecker } from "type-graphql";
import { Role } from "../db/entities/User";
import type { Context } from "../types";

// @ts-ignore
export const authChecker: AuthChecker<Context> = (
  { context },
  roles: Role[]
) => {
  if (!context.user) {
    return false;
  }

  if (context.user.role === Role.ADMIN) {
    return true;
  }

  if (!roles || roles.length === 0) {
    return true;
  }

  if (!roles.some((role: Role) => role === context.user?.role)) {
    return false;
  }

  return true;
};
