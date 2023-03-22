import { useRouter } from "next/router";
import { User } from "../../utils/types";
import Tag from "../Tag";

import styles from "./UserTag.module.scss";

type UserTagProps = {
  user: User;
  onClick?: () => void;
};

const UserTag = ({
  user: { id, username, pictureUrl = "/default_profile_picture.jpeg" },
  onClick,
}: UserTagProps) => {
  const router = useRouter();
  return (
    <Tag
      className={styles["user-tag"]}
      onClick={() => (onClick ? onClick() : router.push(`/users/${id}`))}
    >
      <img alt="profile" src={pictureUrl} />
      <label>{username}</label>
    </Tag>
  );
};

export default UserTag;
