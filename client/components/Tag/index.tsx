import { ReactNode } from "react";
import { Role } from "../../utils/const";
import styles from "./Tag.module.scss";

export enum TagStyle {
  success = "success",
  danger = "danger",
  info = "info",
  warning = "warning",
}

export const getRoleStyle = (role: Role): TagStyle => {
  let style;
  switch (role) {
    case Role.ADMIN:
      style = TagStyle.danger;
      break;
    case Role.RESIDENT:
      style = TagStyle.success;
      break;
    case Role.ALUMNI:
      style = TagStyle.info;
      break;
    case Role.GUEST:
      style = TagStyle.warning;
      break;
  }

  return style;
};

type TagProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  shallow?: boolean;
  style?: TagStyle;
};

const Tag = ({ children, onClick, className, shallow, style }: TagProps) => (
  <div
    className={`${styles["tag"]} ${className || ""} 
    ${onClick ? styles.clickable : ""} ${shallow ? styles.shallow : ""}
    ${style ? styles[style] : ""}`}
    onClick={() => onClick?.()}
  >
    {children}
  </div>
);

export default Tag;
