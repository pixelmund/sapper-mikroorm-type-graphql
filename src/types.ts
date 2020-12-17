import type { User } from "./generated/graphql";

export type Test = {
  hello: string;
};

export enum ClientRole {
  USER,
  MODERATOR,
  ADMIN,
}

export interface PreloadContext {
  fetch: (url: string, options?: any) => Promise<any>;
  error: (statusCode: number, message: Error | string) => void;
  redirect: (statusCode: number, location: string) => void;
}
export interface PreloadPage {
  host: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
}
export interface PreloadFunction {
  (this: PreloadContext, page: PreloadPage, session: { user: User }):
    | any
    | Promise<any>;
}
