import { query, mutation } from "svelte-apollo";
import { writable } from "svelte/store";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  takeSurvey?: Maybe<Survey>;
  hasCompletedSurvey: Scalars["Boolean"];
  getResult?: Maybe<ResultResponseType>;
  users: Array<User>;
  user?: Maybe<User>;
};

export type QueryUserArgs = {
  id: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  role: Role;
  email?: Maybe<Scalars["String"]>;
  passwordResets: Array<PasswordReset>;
};

export enum Role {
  User = "USER",
  Moderator = "MODERATOR",
  Admin = "ADMIN",
}

export type PasswordReset = {
  __typename?: "PasswordReset";
  id: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  expiresAt: Scalars["DateTime"];
};

export type Survey = {
  __typename?: "Survey";
  id: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  categories: Array<Category>;
  questions: Array<Question>;
  answers: Array<Answer>;
};

export type Category = {
  __typename?: "Category";
  id: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  name: Scalars["String"];
  image?: Maybe<Scalars["String"]>;
  published?: Maybe<Scalars["Boolean"]>;
  survey: Survey;
  questions: Array<Question>;
  answers: Array<Answer>;
  finished: Scalars["Boolean"];
};

export type Question = {
  __typename?: "Question";
  id: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  question: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  survey: Survey;
  category: Category;
  choices: Array<Choice>;
  answers: Array<Answer>;
  actions: Array<Action>;
};

export type Choice = {
  __typename?: "Choice";
  id: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  choice: Scalars["String"];
  sortIndex: Scalars["Float"];
  question: Question;
  answers: Array<Answer>;
  actions: Array<Action>;
  selected: Scalars["Boolean"];
};

export type Answer = {
  __typename?: "Answer";
  id: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  choice: Choice;
  question: Question;
  survey: Survey;
  category: Category;
};

export type Action = {
  __typename?: "Action";
  id: Scalars["ID"];
  createdAt: Scalars["DateTime"];
  updatedAt: Scalars["DateTime"];
  question: Question;
  choice: Choice;
  type: ActionTypes;
  value: Scalars["Float"];
};

export enum ActionTypes {
  Add = "ADD",
  Reduce = "REDUCE",
  Entry = "ENTRY",
}

export type ResultResponseType = {
  __typename?: "ResultResponseType";
  level: Scalars["String"];
  value: Scalars["Int"];
  categories: Array<KeyStringValueIntObjectType>;
};

export type KeyStringValueIntObjectType = {
  __typename?: "KeyStringValueIntObjectType";
  key: Scalars["String"];
  value: Scalars["Int"];
};

export type Mutation = {
  __typename?: "Mutation";
  login: AuthResponse;
  logout: Scalars["Boolean"];
  register: AuthResponse;
  forgotPassword: AuthResponse;
  resetPassword: AuthResponse;
  selectChoice?: Maybe<Choice>;
  createUser: User;
  updateUser?: Maybe<User>;
};

export type MutationLoginArgs = {
  input: UserInput;
};

export type MutationRegisterArgs = {
  input: UserInput;
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationResetPasswordArgs = {
  newPassword: Scalars["String"];
  id: Scalars["String"];
};

export type MutationSelectChoiceArgs = {
  choiceId: Scalars["String"];
  questionId: Scalars["String"];
  categoryId: Scalars["String"];
  surveyId: Scalars["String"];
};

export type MutationCreateUserArgs = {
  input: UserInputType;
};

export type MutationUpdateUserArgs = {
  input: UserInputType;
};

export type AuthResponse = {
  __typename?: "AuthResponse";
  success: Scalars["Boolean"];
  user?: Maybe<User>;
  errors?: Maybe<Array<FieldErrors>>;
};

export type FieldErrors = {
  __typename?: "FieldErrors";
  field: Scalars["String"];
  message: Scalars["String"];
};

export type UserInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type UserInputType = {
  email: Scalars["String"];
  password?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["String"]>;
};

export type LoginMutationVariables = Exact<{
  input: UserInput;
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  login: { __typename?: "AuthResponse" } & Pick<AuthResponse, "success"> & {
      user?: Maybe<{ __typename?: "User" } & Pick<User, "id" | "email">>;
      errors?: Maybe<
        Array<
          { __typename?: "FieldErrors" } & Pick<
            FieldErrors,
            "field" | "message"
          >
        >
      >;
    };
};

export type RegisterMutationVariables = Exact<{
  input: UserInput;
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
  register: { __typename?: "AuthResponse" } & Pick<AuthResponse, "success"> & {
      user?: Maybe<{ __typename?: "User" } & Pick<User, "id" | "email">>;
      errors?: Maybe<
        Array<
          { __typename?: "FieldErrors" } & Pick<
            FieldErrors,
            "field" | "message"
          >
        >
      >;
    };
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "logout"
>;

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars["String"];
}>;

export type ForgotPasswordMutation = { __typename?: "Mutation" } & {
  forgotPassword: { __typename?: "AuthResponse" } & Pick<
    AuthResponse,
    "success"
  > & {
      errors?: Maybe<
        Array<
          { __typename?: "FieldErrors" } & Pick<
            FieldErrors,
            "field" | "message"
          >
        >
      >;
    };
};

export type ResetPasswordMutationVariables = Exact<{
  id: Scalars["String"];
  newPassword: Scalars["String"];
}>;

export type ResetPasswordMutation = { __typename?: "Mutation" } & {
  resetPassword: { __typename?: "AuthResponse" } & Pick<
    AuthResponse,
    "success"
  > & {
      errors?: Maybe<
        Array<
          { __typename?: "FieldErrors" } & Pick<
            FieldErrors,
            "field" | "message"
          >
        >
      >;
      user?: Maybe<{ __typename?: "User" } & Pick<User, "email">>;
    };
};

export type TakeSurveyQueryVariables = Exact<{ [key: string]: never }>;

export type TakeSurveyQuery = { __typename?: "Query" } & {
  takeSurvey?: Maybe<
    { __typename?: "Survey" } & Pick<Survey, "id" | "name" | "description"> & {
        categories: Array<
          { __typename?: "Category" } & Pick<
            Category,
            "id" | "name" | "image" | "finished"
          > & {
              questions: Array<
                { __typename?: "Question" } & Pick<
                  Question,
                  "id" | "question"
                > & {
                    choices: Array<
                      { __typename?: "Choice" } & Pick<
                        Choice,
                        "id" | "choice" | "selected"
                      >
                    >;
                  }
              >;
            }
        >;
      }
  >;
};

export type GetResultQueryVariables = Exact<{ [key: string]: never }>;

export type GetResultQuery = { __typename?: "Query" } & {
  getResult?: Maybe<
    { __typename?: "ResultResponseType" } & Pick<
      ResultResponseType,
      "level" | "value"
    > & {
        categories: Array<
          { __typename?: "KeyStringValueIntObjectType" } & Pick<
            KeyStringValueIntObjectType,
            "key" | "value"
          >
        >;
      }
  >;
};

export type HasCompletedSurveyQueryVariables = Exact<{ [key: string]: never }>;

export type HasCompletedSurveyQuery = { __typename?: "Query" } & Pick<
  Query,
  "hasCompletedSurvey"
>;

export type SelectChoiceMutationVariables = Exact<{
  categoryId: Scalars["String"];
  surveyId: Scalars["String"];
  choiceId: Scalars["String"];
  questionId: Scalars["String"];
}>;

export type SelectChoiceMutation = { __typename?: "Mutation" } & {
  selectChoice?: Maybe<
    { __typename?: "Choice" } & Pick<Choice, "id" | "choice" | "selected">
  >;
};

export const LoginDoc = gql`
  mutation Login($input: UserInput!) {
    login(input: $input) {
      success
      user {
        id
        email
      }
      errors {
        field
        message
      }
    }
  }
`;
export const RegisterDoc = gql`
  mutation Register($input: UserInput!) {
    register(input: $input) {
      success
      user {
        id
        email
      }
      errors {
        field
        message
      }
    }
  }
`;
export const LogoutDoc = gql`
  mutation Logout {
    logout
  }
`;
export const ForgotPasswordDoc = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      errors {
        field
        message
      }
      success
    }
  }
`;
export const ResetPasswordDoc = gql`
  mutation ResetPassword($id: String!, $newPassword: String!) {
    resetPassword(id: $id, newPassword: $newPassword) {
      errors {
        field
        message
      }
      success
      user {
        email
      }
    }
  }
`;
export const TakeSurveyDoc = gql`
  query TakeSurvey {
    takeSurvey {
      id
      name
      description
      categories {
        id
        name
        image
        finished
        questions {
          id
          question
          choices {
            id
            choice
            selected
          }
        }
      }
    }
  }
`;
export const GetResultDoc = gql`
  query GetResult {
    getResult {
      level
      value
      categories {
        key
        value
      }
    }
  }
`;
export const HasCompletedSurveyDoc = gql`
  query HasCompletedSurvey {
    hasCompletedSurvey
  }
`;
export const SelectChoiceDoc = gql`
  mutation SelectChoice(
    $categoryId: String!
    $surveyId: String!
    $choiceId: String!
    $questionId: String!
  ) {
    selectChoice(
      categoryId: $categoryId
      surveyId: $surveyId
      choiceId: $choiceId
      questionId: $questionId
    ) {
      id
      choice
      selected
    }
  }
`;
export const Login = () =>
  mutation<LoginMutation, LoginMutationVariables>(LoginDoc);

export const Register = () =>
  mutation<RegisterMutation, RegisterMutationVariables>(RegisterDoc);

export const Logout = () =>
  mutation<LogoutMutation, LogoutMutationVariables>(LogoutDoc);

export const ForgotPassword = () =>
  mutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(
    ForgotPasswordDoc
  );

export const ResetPassword = () =>
  mutation<ResetPasswordMutation, ResetPasswordMutationVariables>(
    ResetPasswordDoc
  );

export const TakeSurvey = (variables: TakeSurveyQueryVariables) =>
  query<TakeSurveyQuery, TakeSurveyQueryVariables>(TakeSurveyDoc, {
    variables,
  });

///@ts-ignore

export const takeSurvey = writable<TakeSurveyQuery>({}, (set) => {
  const p = TakeSurvey({});
  p.subscribe((v) => {
    if (!v.loading && v.data) {
      set(v.data);
    }
  });
});
export const GetResult = (variables: GetResultQueryVariables) =>
  query<GetResultQuery, GetResultQueryVariables>(GetResultDoc, {
    variables,
  });

///@ts-ignore

export const getResult = writable<GetResultQuery>({}, (set) => {
  const p = GetResult({});
  p.subscribe((v) => {
    if (!v.loading && v.data) {
      set(v.data);
    }
  });
});
export const HasCompletedSurvey = (
  variables: HasCompletedSurveyQueryVariables
) =>
  query<HasCompletedSurveyQuery, HasCompletedSurveyQueryVariables>(
    HasCompletedSurveyDoc,
    {
      variables,
    }
  );

///@ts-ignore

export const hasCompletedSurvey = writable<HasCompletedSurveyQuery>(
  {},
  (set) => {
    const p = HasCompletedSurvey({});
    p.subscribe((v) => {
      if (!v.loading && v.data) {
        set(v.data);
      }
    });
  }
);
export const SelectChoice = () =>
  mutation<SelectChoiceMutation, SelectChoiceMutationVariables>(
    SelectChoiceDoc
  );
