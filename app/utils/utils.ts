import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "./const";
import { DropdownOption } from "./types";

export const isSSR = () => typeof window === "undefined";

export const isEventOver = (start, end) => {
  if (!start && !end) return false;
  if (end) return end < Date.now();

  return start < Date.now();
};

export const updatePicture = async (
  picture: File,
  endpoint: string,
  eventId?: number
): Promise<string> => {
  const body = new FormData();
  body.append("file", picture);
  if (eventId) {
    body.append("eventId", eventId.toString());
  }

  const token = Cookies.get(ACCESS_TOKEN);
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_URL_SERVER}/upload/${endpoint}`,
    {
      method: "POST",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      body,
    }
  );
  const res = await result.text();

  return res;
};

export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const buildOptionsFromEnum = (_enum): DropdownOption[] =>
  Object.keys(_enum).map((key) => ({
    key,
    label: capitalize(key),
  }));
