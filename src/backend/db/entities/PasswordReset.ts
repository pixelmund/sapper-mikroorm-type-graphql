import { Entity, Property, ManyToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";
import { Base } from "./Base";
import type { User } from "./User";

@ObjectType()
@Entity()
export class PasswordReset extends Base<PasswordReset> {
  @Field()
  @Property()
  expiresAt!: Date;

  @ManyToOne('User', 'passwordResets')
  user!: User;

  constructor(user: any, expiresAt: Date) {
  	super();
  	this.expiresAt = expiresAt;
  	this.user = user;
  }
}