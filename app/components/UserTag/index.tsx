import { useRouter } from "next/router";

import { User } from "../../utils/types";
import Tag from "../Tag";
import UserAvatar from "../UserAvatar";

import styles from "./UserTag.module.scss";

type UserTagProps = {
  user: User;
  onClick?: () => void;
};

const UserTag = ({ user, onClick }: UserTagProps) => {
  const router = useRouter();
  return (
    <Tag
      className={styles["user-tag"]}
      onClick={() => (onClick ? onClick() : router.push(`/users/${user.id}`))}
    >
      <UserAvatar user={user} />
      <label style={user.color ? { color: user.color } : {}}>
        {user.username}
      </label>
    </Tag>
  );
};

export default UserTag;
