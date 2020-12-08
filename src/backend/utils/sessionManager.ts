import type { MikroORM } from "@mikro-orm/core";
import session from "express-session";
import { SESSION_NAME } from "../../config";
import { MikroStore } from "./MikroSessionPg";
import { v4 as uuid } from "uuid";

export function sessionMiddleware(mikro: MikroORM) {
  return session(
    {
        name: SESSION_NAME,
        genid(){
          return uuid()
        },
        cookie: {
          maxAge: 86400000 * 14,
          secure: false,
          signed: false,
          httpOnly: false,
          sameSite: 'strict',
        },
        rolling: false,
        resave: false,
        saveUninitialized: false,
        unset: "destroy",
        secret: 'any secret',
        store: new MikroStore({})
    }
  );
}
