import { wrap } from "@mikro-orm/core";
import { IsString, MaxLength } from "class-validator";
import {
  Arg,
  Authorized,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Post } from "../db/entities/Post";
import { em } from "../db/entityManager";
import type { Context } from "../types";

@InputType()
class PostInputType {
  @IsString()
  @MaxLength(240)
  @Field(() => String)
  caption?: string;
}

@Resolver(() => Post)
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    const postRepo = em.getRepository(Post);
    return await postRepo.findAll();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id") id: string): Promise<Post | null | undefined> {
    const postRepo = em.getRepository(Post);
    return await postRepo.findOne({ id });
  }

  @Authorized()
  @Mutation(() => Post)
  async createPost(@Arg("input") input: PostInputType, @Ctx() { user } : Context) {
    const postRepo = em.getRepository(Post);
    const post = new Post(user, input.caption!);
    await postRepo.persistAndFlush(post);
    return post;
  }

  @Authorized()
  @Mutation(() => Post, { nullable: true })
  async updatePost(@Arg('id') id: string, @Arg("input") input: PostInputType, @Ctx() { user } : Context) {
    const postRepo = em.getRepository(Post);
    const post = await postRepo.findOne({ id, user });

    if (!post) {
      return null;
    }

    wrap(post).assign(input)

    await postRepo.persistAndFlush(post);

    return post;
  }

}
