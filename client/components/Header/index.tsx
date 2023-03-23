import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faRightToBracket,
  faPenToSquare,
  faCalendarWeek,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import useUserContext from "../../services/authentication/user-context";
import { signout } from "../../services/authentication/utils";

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
        {initialized && (
          <div className={styles.header__links}>
            {auth ? (
              <>
                <Link className={`${styles.header__link} link`} href="/users">
                  <FontAwesomeIcon icon={faUsers} /> MEMBERS
                </Link>
                <Link className={`${styles.header__link} link`} href="/events">
                  <FontAwesomeIcon icon={faCalendarWeek} /> EVENTS
                </Link>
                <div
                  className={`${styles.header__link}} link`}
                  onClick={() => signout(dispatch)}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} /> SIGNOUT
                </div>
              </>
            ) : (
              <>
                <Link className={`${styles.header__link} link`} href="/signin">
                  <FontAwesomeIcon icon={faRightToBracket} /> SIGNIN
                </Link>
                <Link className={`${styles.header__link} link`} href="/signup">
                  <FontAwesomeIcon icon={faPenToSquare} /> SIGNUP
                </Link>
              </>
            )}{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
