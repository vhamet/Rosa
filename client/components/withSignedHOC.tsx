import { useRouter } from "next/router";
import useUserContext from "../services/authentication/user-context";

const withSignedHOC = (Component) => {
  const Auth = (props) => {
    const { auth } = useUserContext();
    const router = useRouter();

    if (auth) {
      if (typeof window !== "undefined") {
        router.push("/events");
      }
    }

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    Auth.getInitialProps = Component.getInitialProps;
  }

  return Auth;
};

export default withSignedHOC;
