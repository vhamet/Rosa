import { ReactNode } from "react";
import styles from "./Tag.module.scss";

type TagProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

const Tag = ({ children, onClick, className }: TagProps) => (
  <div
    className={`${styles["tag"]} ${className || ""} ${
      onClick ? styles.clickable : ""
    }`}
    onClick={() => onClick?.()}
  >
    {children}
  </div>
);

export default Tag;
