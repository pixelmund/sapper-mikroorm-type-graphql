import type { Role, User } from "../generated/graphql";
import type { PreloadContext } from "../types";

export const unauthenticated = (ctx: PreloadContext, user: User) => {
  if(!!user){
    return ctx.redirect(302, '/')
  }
}

export const authenticated = (ctx: PreloadContext, role?: Role) => {
    console.log(ctx);
}