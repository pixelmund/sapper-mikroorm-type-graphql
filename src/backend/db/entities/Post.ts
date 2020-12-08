import { Entity, Property, ManyToOne, Enum, OneToMany, Collection } from "@mikro-orm/core";
import { ObjectType, Field, registerEnumType } from "type-graphql";
import { Base } from "./Base";
import type { PostLike } from "./PostLike";
import { User } from "./User";

export enum PostType {
  MEDIA,
  TEXT
}

registerEnumType(PostType, { name: 'PostType' })

@ObjectType()
@Entity()
export class Post extends Base<Post> {
  @Field()
  @Property()
  caption!: string;

  @Field(() => PostType)
  @Enum({ default: PostType.TEXT })
  type!: PostType;

  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  @OneToMany('PostLike', 'post')
	likes = new Collection<PostLike>(this);

  constructor(user: User, caption: string) {
  	super();
  	this.caption = caption;
  	this.user = user;
  }
}