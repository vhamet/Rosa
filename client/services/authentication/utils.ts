import jwtDecode from "jwt-decode";
import { UserReducerActions } from "./user-context";

export const authenticateUser = (accessToken, userDispatch) => {
  const decodedToken = jwtDecode(accessToken);
  localStorage.setItem("auth", accessToken);
  userDispatch({
    type: UserReducerActions.signin,
    payload: decodedToken,
  });
};

export const signout = (userDispatch) => {
  localStorage.removeItem("auth");
  userDispatch({
    type: UserReducerActions.signout,
  });
};
