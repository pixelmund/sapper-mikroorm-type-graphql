import { mutation } from "svelte-apollo";
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
  confirmed?: Maybe<Scalars["Boolean"]>;
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
  user: User;
};

export type Mutation = {
  __typename?: "Mutation";
  login: AuthResponse;
  logout: Scalars["Boolean"];
  register: AuthResponse;
  forgotPassword: AuthResponse;
  resetPassword: AuthResponse;
  confirmUser: AuthResponse;
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

export type MutationConfirmUserArgs = {
  confirmToken: Scalars["String"];
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
      user?: Maybe<
        { __typename?: "User" } & Pick<User, "id" | "confirmed" | "email">
      >;
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
      user?: Maybe<
        { __typename?: "User" } & Pick<User, "id" | "confirmed" | "email">
      >;
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

export const LoginDoc = gql`
  mutation Login($input: UserInput!) {
    login(input: $input) {
      success
      user {
        id
        confirmed
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
        confirmed
        email
      }
      errors {
        field
        message
      }
    }
  }
`;
export const Login = () =>
  mutation<LoginMutation, LoginMutationVariables>(LoginDoc);

export const Register = () =>
  mutation<RegisterMutation, RegisterMutationVariables>(RegisterDoc);
