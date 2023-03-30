import { forwardRef, PropsWithChildren, ReactNode } from "react";
import styles from "./Card.module.scss";

import "./Card.module.scss";

type CardProps = {
  className?: string;
  onClick?: () => {};
  children: ReactNode;
};

const Card = forwardRef<HTMLDivElement, PropsWithChildren<CardProps>>(
  ({ className, onClick, children }: CardProps, ref) => (
    <div
      ref={ref}
      className={`card ${styles.card} ${className || ""}${
        onClick ? " clickable" : ""
      }`}
      onClick={() => onClick?.()}
    >
      {children}
    </div>
  )
);

export default Card;
