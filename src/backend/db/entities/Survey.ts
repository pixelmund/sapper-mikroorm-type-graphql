import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Reference,
  IdentifiedReference,
  Enum,
} from "@mikro-orm/core";
import { ObjectType, Field, registerEnumType } from "type-graphql";
import { Base } from "./Base";
import type { User } from "./User";

@ObjectType()
@Entity()
export class Survey extends Base<Survey> {
  @Field()
  @Property()
  name!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(() => [Category])
  @OneToMany(() => Category, "survey")
  categories = new Collection<Category>(this);

  @Field(() => [Question])
  @OneToMany(() => Question, "survey")
  questions = new Collection<Question>(this);

  @Field(() => [Answer])
  @OneToMany(() => Answer, "survey")
  answers = new Collection<Answer>(this);

  constructor(name: string, description?: string) {
    super();
    this.description = description;
    this.name = name;
  }
}

@ObjectType()
@Entity()
export class Category extends Base<Category> {
  @Field()
  @Property()
  name!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  image?: string;

  @Field({ defaultValue: false })
  @Property()
  published: boolean = false;

  @Field(() => Survey)
  @ManyToOne(() => Survey, "categories")
  survey!: Reference<Survey>;

  @Field(() => [Question])
  @OneToMany(() => Question, "category")
  questions = new Collection<Question>(this);

  @Field(() => [Answer])
  @OneToMany(() => Answer, "category")
  answers = new Collection<Answer>(this);

  constructor(name: string, survey: Reference<Survey>, image?: string) {
    super();
    this.survey = survey;
    this.image = image;
    this.name = name;
  }
}

@ObjectType()
@Entity()
export class Question extends Base<Question> {
  @Field()
  @Property()
  question!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  description?: string;

  @Field(() => Survey)
  @ManyToOne(() => Survey, "questions")
  survey!: Reference<Survey>;

  @Field(() => Category)
  @ManyToOne(() => Category, "questions")
  category!: Reference<Category>;

  @Field(() => [Choice])
  @OneToMany(() => Choice, "question")
  choices = new Collection<Choice>(this);

  @Field(() => [Answer])
  @OneToMany(() => Answer, "question")
  answers = new Collection<Answer>(this);

  constructor(
    question: string,
    category: Reference<Category>,
    survey: Reference<Survey>,
    description?: string
  ) {
    super();
    this.question = question;
    this.category = category;
    this.survey = survey;
    this.description = description;
  }
}

@ObjectType()
@Entity()
export class Choice extends Base<Choice> {
  @Field()
  @Property()
  choice!: string;

  @Field(() => Question)
  @ManyToOne(() => Question, "choices")
  question!: Reference<Question>;

  @Field(() => [Answer])
  @OneToMany(() => Answer, "choice")
  answers = new Collection<Answer>(this);

  @Field(() => [Action])
  @OneToMany(() => Action, "choice")
  actions = new Collection<Action>(this);

  constructor(choice: string, question: Reference<Question>) {
    super();
    this.choice = choice;
    this.question = question;
  }
}

export enum ActionTypes {
  ADD = 1,
  REDUCE = 2,
  ENTRY = 3,
}
registerEnumType(ActionTypes, { name: "ActionTypes" });

@ObjectType()
@Entity()
export class Action extends Base<Action> {
  @Field(() => Choice)
  @ManyToOne(() => Choice, "actions")
  choice!: Reference<Choice>;

  @Field(() => ActionTypes)
  @Enum(() => ActionTypes)
  type!: ActionTypes;

  @Field()
  @Property({ nullable: true })
  value?: number;

  constructor(choice: Reference<Choice>, type: ActionTypes, value?: number) {
    super();
    this.choice = choice;
    this.type = type;
    this.value = value;
  }
}

@ObjectType()
@Entity()
export class Answer extends Base<Answer> {
  @Field(() => Choice)
  @ManyToOne(() => Choice, "answers")
  choice!: Reference<Choice>;

  @Field(() => Question)
  @ManyToOne(() => Question, "answers")
  question!: Reference<Question>;

  @ManyToOne("User", "answers")
  user!: Reference<User>;

  @Field(() => Survey)
  @ManyToOne(() => Survey, "answers")
  survey!: Reference<Survey>;

  @Field(() => Category)
  @ManyToOne(() => Category, "answers")
  category!: Reference<Category>;

  constructor(
    choice: Reference<Choice>,
    question: Reference<Question>,
    user: Reference<User>,
    survey: Reference<Survey>,
    category: Reference<Category>,
  ) {
    super();
    this.choice = choice;
    this.user = user;
    this.question = question;
    this.survey = survey;
    this.category = category;
  }
}
