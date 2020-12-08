import { BaseEntity, PrimaryKey, Property } from "@mikro-orm/core";
import {
	Field, ID, Int, ObjectType,
} from "type-graphql";
import { v4 } from "uuid";

@ObjectType({ isAbstract: true })
export class Base<T extends { id: string }> extends BaseEntity<T, "id"> {
  @Field(() => ID)
  @PrimaryKey({ type: "uuid" })
  public id: string = v4();

  @Field()
  @Property()
  public createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date() })
  public updatedAt: Date = new Date();
}

@ObjectType({ isAbstract: true })
export class BasePkNumber<T extends { id: number }> extends BaseEntity<
  T,
  "id"
> {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ nullable: true })
  public createdAt: Date = new Date();

  @Field()
  @Property({ onUpdate: () => new Date(), nullable: true })
  public updatedAt: Date = new Date();
}
