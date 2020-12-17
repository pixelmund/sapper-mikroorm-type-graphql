import type { User } from "../generated/graphql";
import type { ClientRole, PreloadContext } from "../types";

export const unauthenticated = (ctx: PreloadContext, user: User) => {
  if(!!user){
    ctx.redirect(302, '/')
    return {};
  }
  return {}
}

export const authenticated = (ctx: PreloadContext, user: User, roles?: ClientRole[]) => {
  if(!!!user){
    ctx.redirect(302, '/auth/login')
    return {};
  }
  //@ts-ignore
  if(!roles?.includes(user.role)){
    ctx.redirect(302, '/')
    return {};
  }
  return {};
}