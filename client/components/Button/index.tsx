import styles from "./Button.module.scss";

type ButtonProps = {
  onClick?: () => void;
  label?: string;
};

const Button = ({ onClick = () => {}, label }: ButtonProps) => (
  <button onClick={onClick} className={styles.button}>
    {label}
  </button>
);

export default Button;
