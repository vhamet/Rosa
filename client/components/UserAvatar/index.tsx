import { User } from "../../utils/types";
import styles from "./UserAvatar.module.scss";

export enum AvatarSize {
  small = "1.5rem",
  medium = "3rem",
  large = "4rem",
  xlarge = "6rem",
}

type UserAvatarProps = {
  user: User;
  size?: AvatarSize;
};

const UserAvatar = ({ user, size = AvatarSize.small }: UserAvatarProps) => (
  <img
    className={styles["user-avatar"]}
    src={user.pictureUrl || "/default_profile_picture.jpeg"}
    alt={`${user.username}_avatar`}
    title={user.username}
    style={{ height: size, width: size }}
  />
);

export default UserAvatar;
