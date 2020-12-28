import type { EntityManager } from "@mikro-orm/core";
import type { RequestHandler } from "express";
import session from "express-session";
import { v4 as uuid } from "uuid";
import { SESSION_NAME } from "../../config";
import type { User } from "../db/entities/User";
import { MikroStore } from "../utils/MikroSessionPg";
import { parse } from "cookie";

export default function sessionMiddleware() {
  return ((req: any, res, next) => {
    if (!req.checkSession) {
      return next();
    }
    return session({
      name: SESSION_NAME,
      genid() {
        return uuid();
      },
      cookie: {
        maxAge: 86400000 * 14,
        secure: false,
        signed: false,
        httpOnly: false,
        sameSite: "strict",
      },
      rolling: false,
      resave: false,
      saveUninitialized: false,
      unset: "destroy",
      secret: "any secret",
      store: new MikroStore({}),
    })(req, res, next);
  }) as RequestHandler;
}

export function initializeUserFromSession(em: EntityManager) {
  return (async (req: any, _res, next) => {
    if (!req.checkSession) {
      return next();
    }
    const userId = req?.session?.userId;
    if (!userId) {
      const user = em.create<User>("User", {});
      await em.persistAndFlush(user);
      //@ts-ignore
      req.session.userId = user.id;
      req.user = user;
      return next();
    }
    const user = await em.findOne<User>("User", { id: userId });
    req.user = user;
    return next();
  }) as RequestHandler;
}

export function svazzleSession(req: any) {
  const user: User | null = req.user ? req.user : null;
  const cookie = parse(req.headers?.cookie ?? "")[SESSION_NAME];
  if (!user) {
    return {
      user,
    };
  }
  return {
    cookie,
    user: {
      ...user.toPOJO(),
      passwordHash: undefined,
      confirmToken: undefined,
    },
  };
}
