import { User } from "../../utils/types";
import styles from "./UserAvatar.module.scss";

type UserAvatarProps = {
  user: User;
};

const UserAvatar = ({ user }: UserAvatarProps) => (
  <img
    className={styles["user-avatar"]}
    src={user.pictureUrl || "/default_profile_picture.jpeg"}
    alt={`${user.username}_avatar`}
    title={user.username}
  />
);

export default UserAvatar;
