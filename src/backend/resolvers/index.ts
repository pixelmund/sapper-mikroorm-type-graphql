import { AuthResolver } from "./auth";
import { CategoryResolver, ChoiceResolver, TakeSurveyResolver } from "./survey";
import { UserResolver } from "./user";

export const Resolvers = [
    UserResolver,
    AuthResolver,
    TakeSurveyResolver,
    CategoryResolver,
    ChoiceResolver
] as const;