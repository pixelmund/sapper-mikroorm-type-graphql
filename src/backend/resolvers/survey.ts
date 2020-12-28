import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import {
  Action,
  ActionTypes,
  Answer,
  Category,
  Choice,
  Question,
  Survey,
} from "../db/entities/Survey";
import { em } from "../db/entityManager";
import type { Context } from "../types";

@ObjectType()
class KeyStringValueIntObjectType {
  @Field(() => String)
  key!: string;

  @Field(() => Int)
  value!: number;
}

@ObjectType()
class ResultResponseType {
  @Field(() => String)
  level!: string;

  @Field(() => Int)
  value!: number;

  @Field(() => [KeyStringValueIntObjectType])
  categories!: KeyStringValueIntObjectType[];
}

@Resolver(() => Survey)
export class TakeSurveyResolver {
  @Authorized()
  @Query(() => Survey, { nullable: true })
  async takeSurvey(@Ctx() { user }: Context) {
    await user.answers.init();
    const surveyRepo = em.getRepository(Survey);
    const surveys = await surveyRepo.findAll({
      limit: 1,
      populate: [
        "categories",
        "categories.questions",
        "categories.questions.choices",
      ],
      orderBy: {
        categories: {
          questions: {
            choices: {
              sortIndex: "ASC",
            },
          },
        },
      },
    });
    if (surveys && surveys.length === 0) {
      return null;
    }
    return surveys[0];
  }

  @Authorized()
  @Query(() => Boolean)
  async hasCompletedSurvey(@Ctx() { user }: Context) {
    await user.answers.init({ populate: ["question"] });
    const surveyRepo = em.getRepository(Survey);
    const surveys = await surveyRepo.findAll({
      limit: 1,
      populate: ["questions"],
    });
    if (surveys && surveys.length === 0) {
      return false;
    }
    const survey = surveys[0];
    const questions = survey.questions.getItems();
    const answers = user.answers.getItems();
    let notCompletedQuestions: Question[] = [];
    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      if (answers.find((ans) => ans.question.id === question.id)) {
        continue;
      }
      notCompletedQuestions.push(question);
    }

    return notCompletedQuestions.length === 0 ? true : false;
  }

  @Authorized()
  @Query(() => ResultResponseType, { nullable: true })
  async getResult(@Ctx() { user }: Context) {
    await user.answers.init();
    const surveyRepo = em.getRepository(Survey);
    const surveys = await surveyRepo.findAll({
      limit: 1,
      populate: [
        "questions.category",
        "questions.actions",
        "questions.actions.choice",
      ],
    });
    if (surveys && surveys.length === 0) {
      return null;
    }
    const answers = await user.answers.init();
    const survey = surveys[0];
    const questions = survey.questions.getItems();
    const actions = questions.reduce<Action[]>(
      (acc, cur) => [...acc, ...cur.actions.getItems()],
      []
    );
    const respondedChoices = answers.getItems().map((cur) => cur.choice);
    const matchingActions: Action[] = actions
      .map<any>((act) => {
        const matching = respondedChoices?.find(
          (ch) => ch.id === act.choice?.id
        );
        if (matching) {
          return act;
        }
      })
      .filter(Boolean);

    let allResultsValue: number = 0;
    let results: { [key: string]: number } = {};

    for (let index = 0; index < matchingActions.length; index++) {
      const action = matchingActions[index];
      if (
        action.type === ActionTypes.ADD ||
        action.type === ActionTypes.REDUCE
      ) {
        //@ts-ignore
        const categoryName = action.question.category.name;
        if (!results[categoryName]) {
          allResultsValue += action.value!;
          if (action.type === ActionTypes.ADD) {
            results[categoryName] = 0 + action.value!;
          } else {
            results[categoryName] = 0;
          }
        } else {
          allResultsValue -= action.value!;
          if (action.type === ActionTypes.ADD) {
            results[categoryName] += action.value!;
          } else {
            if (results[categoryName] > action.value!) {
              results[categoryName] -= action.value!;
            }
          }
        }
      }
    }

    return {
      level: "Beginner",
      value: allResultsValue < 0 ? 0 : allResultsValue,
      categories: Object.entries(results).map(([key, value]) => ({
        key,
        value,
      })),
    };
  }

  @Authorized()
  @Mutation(() => Choice, { nullable: true })
  async selectChoice(
    @Arg("surveyId") surveyId: string,
    @Arg("categoryId") categoryId: string,
    @Arg("questionId") questionId: string,
    @Arg("choiceId") choiceId: string,
    @Ctx() { user }: Context
  ) {
    const survey = em.getReference<Survey>("Survey", surveyId);
    const category = em.getReference<Category>("Category", categoryId);
    const question = em.getReference<Question>("Question", questionId);
    const choice = await em.findOneOrFail<Choice>("Choice", {
      id: choiceId,
      question,
    });
    await user.answers.init({ where: { question } });
    const answers = user.answers.getItems();
    const answerIndx = answers.findIndex((ans) => ans.choice.id === choice.id);
    if (answerIndx !== -1) {
      return choice;
    }
    if (answers.length > 0) {
      const oldAnswer = answers[0];
      //@ts-ignore
      oldAnswer.choice = choice;
    } else {
      user.answers.add(
        em.create<Answer>("Answer", {
          question,
          choice,
          user,
          survey,
          category,
        })
      );
    }
    await em.flush();
    return choice;
  }
}

@Resolver(() => Category)
export class CategoryResolver {
  @FieldResolver(() => Boolean)
  finished(@Root() root: Category, @Ctx() { user }: Context) {
    const questions = root.questions.count();
    const answers = user.answers.count();
    if (questions === answers) {
      return true;
    }
    return false;
  }
}

@Resolver(() => Choice)
export class ChoiceResolver {
  @FieldResolver(() => Boolean)
  async selected(@Root() root: Choice, @Ctx() { user }: Context) {
    const selected = user.answers
      .getItems()
      .find((ans) => ans.choice.id === root.id);
    if (selected) {
      return true;
    }
    return false;
  }
}
