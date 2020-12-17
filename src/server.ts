import "dotenv/config";
import {
  middleware,
  registerTemplateTransformer,
  SvazzleRequest,
} from "@svazzle/server";
import express, { Express } from "express";
import sirv from "sirv";
import { createApolloServer } from "./backend";
import { initializeMikroOrm } from "./backend/db/entityManager";
import type { User } from "./backend/db/entities/User";
import { parse } from "cookie";
import { SESSION_NAME, THEME_COOKIE_NAME } from "./config";
import session from "express-session";
import { v4 as uuid } from "uuid";
import { MikroStore } from "./backend/utils/MikroSessionPg";

const PORT = process.env.PORT; // eslint-disable-line prefer-destructuring
const mode = process.env.NODE_ENV;
const dev = mode === "development";

interface LuutsRequest extends SvazzleRequest {
  theme: "light" | "dark";
  user: User;
}

registerTemplateTransformer<LuutsRequest>((template, data) => {
  return template.replace(
    "%htmlattributes%",
    `class='${data.req?.theme === "dark" ? "dark" : ""}'`
  );
});

const createSvazzleAndApolloServer = async (
  graphqlPath: string
): Promise<Express> => {
  const app = express();
  app.use(sirv("static", { dev }));
  app.use((req: any, _res, next) => {
    if (["/client", "/static","/service-worker"].some((v) => req.path.includes(v))) {
      req.checkSession = false;
    }else {
      req.checkSession = true;
    }
    return next();
  });
  const mikro = await initializeMikroOrm();
  if (process.env.NODE_ENV === "development") {
    mikro.getSchemaGenerator().updateSchema();
  }
  app.use((req: any, res, next) => {
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
  });
  app.use(async (req: any, _, next) => {
    if (!req.checkSession) {
      return next();
    }
    let theme = "dark";
    if (req.headers.cookie) {
      const cookies = parse(req.headers.cookie);
      theme = cookies?.[THEME_COOKIE_NAME] ?? "dark";
    }
    req.theme = theme;

    const userId = req?.session?.userId;
    if (!userId) {
      return next();
    }
    const user = await mikro.em.findOne<User>("User", { id: userId });
    req.user = user;
    return next();
  });
  const apolloServer = await createApolloServer();
  apolloServer.applyMiddleware({ app, path: graphqlPath });

  app.use(
    //@ts-ignore
    middleware<LuutsRequest>({
      session: (req) => {
        const user: User | null = req.user ? req.user : null;
        if (!user) {
          return {
            user,
            theme: req.theme,
          };
        }
        return {
          user: {
            ...user.toPOJO(),
            passwordHash: undefined,
            confirmToken: undefined,
          },
          theme: req.theme,
        };
      },
    })
  );

  return app;
};

createSvazzleAndApolloServer("/graphql").then((app) => {
  app.listen(PORT, (err?: any): void => {
    // eslint-disable-line
    if (err) console.log("error", err);
  });
});
