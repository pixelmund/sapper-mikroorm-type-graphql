import type { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { ObjectType, Field } from "type-graphql";
import type { User } from "./db/entities/User";

export type Context = {
  ctx: ExpressContext,
  user: User,
  session: ExpressContext['req']['session']
}

@ObjectType()
export class FieldErrors {
  @Field()
  field!: string;

  @Field()
  message!: string;
}
