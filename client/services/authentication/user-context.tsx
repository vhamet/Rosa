import jwtDecode from "jwt-decode";
import { useReducer, createContext, useContext, Dispatch } from "react";

export enum UserReducerActions {
  signin = "signin",
  signout = "signout",
}

type AuthenticationType = {
  username: string;
};

type AuthenticationActionType =
  | { type: UserReducerActions.signin; payload: AuthenticationType }
  | { type: UserReducerActions.signout };

export type UserContextType = {
  auth: AuthenticationType;
  dispatch: Dispatch<AuthenticationActionType>;
};

function reducer(state: UserContextType, action: AuthenticationActionType) {
  switch (action.type) {
    case UserReducerActions.signin:
      return { ...state, auth: action.payload };
    case UserReducerActions.signout:
      return { ...state, auth: null };
    default:
      throw new Error();
  }
}

const UserContext = createContext<UserContextType>(null);
const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const accessToken =
    typeof window !== "undefined" && localStorage.getItem("auth");
  const decodedToken: AuthenticationType =
    accessToken && jwtDecode(accessToken);

  const [state, dispatch] = useReducer(reducer, {
    auth: decodedToken,
    dispatch: () => {},
  });
  const contextValue = { auth: state.auth, dispatch };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default useUserContext;
