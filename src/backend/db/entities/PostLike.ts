import { Entity, ManyToOne, Unique } from "@mikro-orm/core";
import { Base } from "./Base";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
@Unique<{post: Post, fromUser: User}>({ properties: ['fromUser', 'post'] })
export class PostLike extends Base<PostLike> {
  @ManyToOne(() => Post, 'likes')
  post!: Post;

  @ManyToOne(() => User, 'likedPosts')
  fromUser!: User;

  constructor(fromUser: User, post: Post) {
  	super();
  	this.fromUser = fromUser;
  	this.post = post;
  }
}