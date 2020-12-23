import { Base } from "./Base";
import { Session } from "./Session";
import { PasswordReset } from "./PasswordReset";
import { User } from "./User";
import { Answer, Category, Choice, Question, Survey, Action } from "./Survey";

export const Entities = [Base, Session, PasswordReset, User, Survey, Category, Question, Answer, Choice, Action];
