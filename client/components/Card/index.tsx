import { ReactNode } from "react";
import styles from "./Card.module.scss";

type CardProps = {
  classnames?: string;
  children: ReactNode;
};

const Card = ({ classnames, children }: CardProps) => (
  <div className={`${styles.card} ${classnames}`}>{children}</div>
);

export default Card;
