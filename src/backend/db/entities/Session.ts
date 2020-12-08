import { Entity, PrimaryKey, Property, BigIntType } from "@mikro-orm/core";

@Entity()
export class Session {
  @PrimaryKey()
  pk!: number;

  @Property()
  id!: string;

  @Property({ type: BigIntType, index: true })
  maxAge!: number;

  @Property({ length: 1000 })
  data!: string;
}