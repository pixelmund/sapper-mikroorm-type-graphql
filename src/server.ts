import "dotenv/config";
import { middleware } from "@sapper/server"; // eslint-disable-line import/no-unresolved
import compression from "compression";
import express, { Express } from "express";
import sirv from "sirv";
import { createApolloServer } from "./backend";
import { initializeMikroOrm } from "./backend/db/entityManager";
import { sessionMiddleware } from "./backend/utils/sessionManager";
import type { User } from "./backend/db/entities/UserAndRelatedEntities";

const PORT = process.env.PORT; // eslint-disable-line prefer-destructuring
const mode = process.env.NODE_ENV;
const dev = mode === "development";

const createSapperAndApolloServer = async (graphqlPath: string): Promise<Express> => {
	const app = express();
	const mikro = await initializeMikroOrm();
	if (process.env.NODE_ENV === "development") {
		mikro.getSchemaGenerator().updateSchema();
	}
	app.use(sessionMiddleware(mikro));
	app.use(async (req,_,next) => {
 	  //@ts-ignore
	  const userId = req?.session?.userId	
	  if(!userId){
		return next();
	  }	
	  const user = await mikro.em.findOne<User>('User', { id: userId });
	  // remove sensitive fields
	  delete user?.passwordHash;
	  //@ts-ignore
	  req.user = user;
	  return next();
	})
	const apolloServer = await createApolloServer();
	apolloServer.applyMiddleware({ app, path: graphqlPath });

	app.use(
		compression({ threshold: 0 }),
		sirv("static", { dev }),
		middleware({
			session: (req: any) => {
				const user : User = req.user ? req.user : null;
				if(!user){
					return {
						user
					}
				}
				return {
					user: user.toPOJO()
				}
			}
		}),
	);

	return app;
};

createSapperAndApolloServer("/graphql").then((app) => {
	app.listen(PORT, (err?: any): void => { // eslint-disable-line
		if (err) console.log("error", err);
	});
});
