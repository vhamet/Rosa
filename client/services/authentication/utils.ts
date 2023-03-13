import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { UserReducerActions } from "./user-context";
import { ACCESS_TOKEN } from "../../utils/const";

export const authenticateUser = (accessToken, userDispatch) => {
  const decodedToken = jwtDecode(accessToken);
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
