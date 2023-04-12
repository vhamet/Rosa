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
import UserAvatar, { AvatarSize } from "../UserAvatar";
import useCurrentUser from "../hooks/useCurrentUser";

import styles from "./Header.module.scss";

const Header = () => {
  const { dispatch } = useUserContext();
  const user = useCurrentUser();
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
            {user ? (
              <>
                <Link className={`${styles.header__link} link`} href="/users">
                  <FontAwesomeIcon icon={faUsers} /> Members
                </Link>
                <Link className={`${styles.header__link} link`} href="/events">
                  <FontAwesomeIcon icon={faCalendarWeek} /> Events
                </Link>
                <HeaderMenu
                  header={
                    <div className={`${styles.header__profile} link`}>
                      <UserAvatar user={user} size={AvatarSize.xsmall} />
                      <label style={user.color ? { color: user.color } : {}}>
                        {user.username}
                      </label>
                    </div>
                  }
                >
                  <Link
                    className={`${styles.header__link} link`}
                    href={`/users/${user.id}`}
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
