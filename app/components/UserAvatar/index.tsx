import { User } from "../../utils/types";
import styles from "./UserAvatar.module.scss";

export enum AvatarSize {
  xsmall = "1rem",
  small = "1.5rem",
  medium = "3rem",
  large = "4rem",
  xlarge = "6rem",
}

type UserAvatarProps = {
  user: User;
  size?: AvatarSize;
  preview?: string;
};

const UserAvatar = ({
  user,
  size = AvatarSize.small,
  preview,
}: UserAvatarProps) => (
  <div
    className={styles["user-avatar"]}
    title={user.username}
    style={{ height: size, width: size, minHeight: size, minWidth: size }}
  >
    <img
      src={
        preview ||
        (user.pictureUrl
          ? `${process.env.NEXT_PUBLIC_URL_SERVER}${user.pictureUrl}`
          : "/default_profile_picture.jpeg")
      }
      alt={`${user.username}_avatar`}
    />
  </div>
);

export default UserAvatar;
