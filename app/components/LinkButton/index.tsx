import Link from "next/link";
import styles from "./LinkButton.module.scss";

type LinkButtonProps = {
  to: string;
  label: string;
};

const LinkButton = ({ to, label }: LinkButtonProps) => (
  <Link className={styles["link-button"]} href={to}>
    {label}
  </Link>
);

export default LinkButton;
