import Link from "next/link";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faRightToBracket,
  faPenToSquare,
  faCalendarWeek,
  faUsers,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import HeaderMenu from "../HeaderMenu";
import useUserContext from "../../services/authentication/user-context";
import { signout } from "../../services/authentication/utils";

import styles from "./Header.module.scss";
import UserAvatar, { AvatarSize } from "../UserAvatar";

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
                <HeaderMenu
                  header={
                    <div className={`${styles.header__profile} link`}>
                      <UserAvatar user={auth} size={AvatarSize.xsmall} />
                      <label style={auth.color ? { color: auth.color } : {}}>
                        {auth.username}
                      </label>
                    </div>
                  }
                >
                  <Link
                    className={`${styles.header__link} link`}
                    href={`/users/${auth.id}`}
                  >
                    <FontAwesomeIcon icon={faUser} /> Profile
                  </Link>
                  <div
                    className={`${styles.header__link} link`}
                    onClick={() => signout(dispatch)}
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} /> Signout
                  </div>
                </HeaderMenu>
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
