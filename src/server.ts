import "dotenv/config";
import {
  middleware,
  registerTemplateTransformer,
  SvazzleRequest
} from "@svazzle/server";
import compression from "compression";
import express, { Express } from "express";
import sirv from "sirv";
import { createApolloServer } from "./backend";
import { initializeMikroOrm } from "./backend/db/entityManager";
import { sessionMiddleware } from "./backend/utils/sessionManager";
import type { User } from "./backend/db/entities/User";
import { parse } from "cookie";
import { THEME_COOKIE_NAME } from "./config";

const PORT = process.env.PORT; // eslint-disable-line prefer-destructuring
const mode = process.env.NODE_ENV;
const dev = mode === "development";

interface LuutsRequest extends SvazzleRequest {
  theme: 'light' | 'dark',
  user: User
}

registerTemplateTransformer<LuutsRequest>((template, data) => {
  return template.replace(
    "%svazzle.htmlAttributes%",
    `class='${data.req?.theme === 'dark' ? 'dark' : ''}'`
  );
});

const createSvazzleAndApolloServer = async (
  graphqlPath: string
): Promise<Express> => {
  const app = express();
  const mikro = await initializeMikroOrm();
  if (process.env.NODE_ENV === "development") {
    mikro.getSchemaGenerator().updateSchema();
  }
  app.use(sessionMiddleware(mikro));
  app.use(async (req: any, _, next) => {
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
    //@ts-ignore I dont know what this type error is
    compression({ threshold: 0 }),
    sirv("static", { dev }),
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
            passwordHash: null,
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
