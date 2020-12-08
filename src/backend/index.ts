import "reflect-metadata";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Resolvers } from "./resolvers";
import { authChecker } from "./utils/authChecker";

export const createApolloServer = async (): Promise<ApolloServer> => {
	const schema = await buildSchema({ resolvers: Resolvers, authChecker, emitSchemaFile: path.resolve(__dirname, '..', '..','..', 'schema.gql') });

	const apolloServer = new ApolloServer({
		schema,
		playground: true,
		context: (ctx) => {
			return {
			  ctx,
			  //@ts-ignore
			  user: ctx.req.user,
			  session: ctx.req.session
			}
		  },
		introspection: true,
	});

	return apolloServer;
};
