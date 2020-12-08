import { AuthResolver } from "./auth";
import { UserResolver } from "./user";

export const Resolvers = [
    UserResolver,
    AuthResolver,
] as const;