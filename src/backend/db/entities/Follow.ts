import { Entity, ManyToOne, Unique } from "@mikro-orm/core";
import { Base } from "./Base";
import { User } from "./User";

@Entity()
@Unique<{ toUser: User; fromUser: User }>({
  properties: ["fromUser", "toUser"],
})
@Unique<{ toUser: User; fromUser: User }>({
  properties: ["toUser", "fromUser"],
})
export class Follow extends Base<Follow> {
  @ManyToOne(() => User, "follows")
  toUser!: User;

  @ManyToOne(() => User, "followed")
  fromUser!: User;

  constructor(fromUser: User, toUser: User) {
    super();
    this.fromUser = fromUser;
    this.toUser = toUser;
  }
}
