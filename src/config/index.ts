import type { Role } from "../backend/db/entities/UserAndRelatedEntities";

export const SESSION_NAME = "luuts.session";
export const AUTH_COOKIE_NAME = "luuts.auth";
export const AUTH_COOKIE_VALUE = (roleType: Role) =>
  `luuts.${roleType}`;
export const HAS_MOBILE_AUTH = true; 