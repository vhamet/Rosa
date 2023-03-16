import styles from "./Button.module.scss";

type ButtonProps = {
  onClick?: () => void;
  label?: string;
};

const Button = ({ onClick = () => {}, label }: ButtonProps) => (
  <div className={styles.button}>
    <button onClick={onClick} className={styles.button__action}>
      {label}
    </button>
  </div>
);

export default Button;
