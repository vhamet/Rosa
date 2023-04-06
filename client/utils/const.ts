import { buildOptionsFromEnum, capitalize } from "./utils";

export const ACCESS_TOKEN = "ACCESS_TOKEN";

export enum Role {
  GUEST = "GUEST",
  ALUMNI = "ALUMNI",
  RESIDENT = "RESIDENT",
  ADMIN = "ADMIN",
}

export const ROLE_OPTIONS = buildOptionsFromEnum(Role);

export enum Privacy {
  PUBLIC = "PUBLIC",
  ALUMNI = "ALUMNI",
  RESIDENT = "RESIDENT",
}

export const PRIVACY_OPTIONS = buildOptionsFromEnum(Privacy);
