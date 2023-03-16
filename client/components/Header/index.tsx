import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faRightToBracket,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
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
      <div className={styles.header__logo}>
        <Link href="/">Rosa</Link>
      </div>
      <div>
        {initialized &&
          (auth ? (
            <div
              className="link"
              onClick={() => dispatch({ type: UserReducerActions.signout })}
            >
              <FontAwesomeIcon icon={faRightFromBracket} /> SIGNOUT
            </div>
          ) : (
            <div className={styles.header__authentication}>
              <Link className="link" href="/signin">
                <FontAwesomeIcon icon={faRightToBracket} /> SIGNIN
              </Link>
              <Link className="link" href="/signup">
                <FontAwesomeIcon icon={faPenToSquare} /> SIGNUP
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Header;
