import { Dispatch } from "react";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import {
  AuthenticationActionType,
  AuthenticationType,
  UserReducerActions,
} from "./user-context";
import { ACCESS_TOKEN } from "../../utils/const";

export const authenticateUser = (
  accessToken: string,
  userDispatch: Dispatch<AuthenticationActionType>
) => {
  const decodedToken = jwtDecode<AuthenticationType>(accessToken);
  Cookies.set(ACCESS_TOKEN, accessToken, { expires: 7, path: "" });

  userDispatch({
    type: UserReducerActions.signin,
    payload: decodedToken,
  });
};

export const signout = (userDispatch) => {
  Cookies.remove(ACCESS_TOKEN);
  userDispatch({
    type: UserReducerActions.signout,
  });
};
