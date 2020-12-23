import type { Role } from "../backend/db/entities/User";

export const SESSION_NAME = "luuts.session";
export const THEME_COOKIE_NAME = 'luuts.theme';
export const AUTH_COOKIE_VALUE = (roleType: Role) =>
  `luuts.${roleType}`;
export const HAS_MOBILE_AUTH = true; 