import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

import UserAvatar, { AvatarSize } from "../../components/UserAvatar";
import { daysDiff } from "../../utils/dates";
import { User } from "../../utils/types";

import styles from "./[id].module.scss";

type ProfileProps = {
  user: User;
};

const Profile = ({ user }: ProfileProps) => (
  <div className={styles["profile__container"]}>
    <UserAvatar user={user} size={AvatarSize.xlarge} />
    <div className={styles["profile__info"]}>
      <label
        className={styles["profile__name"]}
        style={user.color ? { color: user.color } : {}}
      >
        {user.username}
      </label>
      <label className={styles["profile__phone"]}>
        <FontAwesomeIcon icon={faPhone} /> {user.phone || "N/A"}
      </label>
      <label className={styles["profile__since"]}>
        Member for {daysDiff(user.createdAt.toString(), Date.now())} days
      </label>
    </div>
  </div>
);

export default Profile;