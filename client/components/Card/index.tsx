import { ReactNode } from "react";
import styles from "./Card.module.scss";

import "./Card.module.scss";

type CardProps = {
  classnames?: string;
  onClick?: () => {};
  children: ReactNode;
};

const Card = ({ classnames, onClick, children }: CardProps) => (
  <div
    className={`card ${styles.card} ${classnames || ""}${
      onClick ? " clickable" : ""
    }`}
    onClick={() => onClick?.()}
  >
    {children}
  </div>
);

export default Card;
