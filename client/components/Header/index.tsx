import Link from "next/link";
import { useEffect, useState } from "react";
import useUserContext, {
  UserReducerActions,
} from "../../services/authentication/user-context";

import styles from "./Header.module.scss";

const Header = () => {
  const { auth, dispatch } = useUserContext();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
    }
  }, [initialized]);

  return (
    <div className={styles.header}>
      <div>Rosa</div>
      <div>
        {initialized &&
          (auth ? (
            <div onClick={() => dispatch({ type: UserReducerActions.signout })}>
              SIGNOUT
            </div>
          ) : (
            <div>
              <Link href="/signin">Sign in</Link>
              <Link href="/signup">Sign up</Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Header;
