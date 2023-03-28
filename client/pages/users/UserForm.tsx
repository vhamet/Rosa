import { User } from "../../utils/types";
import styles from "./[id].module.scss";

type UserFormProps = {
  user: User;
};

const UserForm = ({ user }: UserFormProps) => {
  <div className={styles["user-form"]}></div>;
};

export default UserForm;
