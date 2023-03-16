import styles from "./Card.module.scss";

const Card = ({ classnames, children }) => (
  <div className={`${styles.card} ${classnames}`}>{children}</div>
);

export default Card;
