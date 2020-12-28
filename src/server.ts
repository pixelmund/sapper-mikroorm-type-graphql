import "dotenv/config";
import {
  middleware,
  SvazzleRequest,
} from "@svazzle/server";
import express, { Express } from "express";
import sirv from "sirv";
import { createApolloServer } from "./backend";
import { initializeMikroOrm } from "./backend/db/entityManager";
import type { User } from "./backend/db/entities/User";
import seedSurvey from "./backend/db/seeds/survey";
import isGraphqlRequest from "./backend/middlewares/is-graphql-request";
import sessionMiddleware, { initializeUserFromSession, svazzleSession as session } from "./backend/middlewares/session-middleware";

const PORT = process.env.PORT;
const mode = process.env.NODE_ENV;
const dev = mode === "development";

interface LuutsRequest extends SvazzleRequest {
  user: User;
}

const createSvazzleAndApolloServer = async (
  graphqlPath: string
): Promise<Express> => {
  const app = express();
  app.use(sirv("static", { dev }));
  app.use(isGraphqlRequest());
  const mikro = await initializeMikroOrm();
  if (process.env.NODE_ENV === "development") {
    mikro.getSchemaGenerator().updateSchema();
    await seedSurvey(mikro.em);
  }
  app.use(sessionMiddleware());
  app.use(initializeUserFromSession(mikro.em));
  const apolloServer = await createApolloServer();
  apolloServer.applyMiddleware({ app, path: graphqlPath });
  app.use(
    //@ts-ignore
    middleware<LuutsRequest>({
      session
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
