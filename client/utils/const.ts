import { capitalize } from "./utils";

export const ACCESS_TOKEN = "ACCESS_TOKEN";

export enum Role {
  GUEST = "GUEST",
  ALUMNI = "ALUMNI",
  RESIDENT = "RESIDENT",
  ADMIN = "ADMIN",
}

export const ROLE_OPTIONS = Object.keys(Role).map((key) => ({
  key,
  label: capitalize(key),
}));
