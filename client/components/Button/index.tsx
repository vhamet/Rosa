import styles from "./Button.module.scss";

export enum ButtonKind {
  primary = "primary",
  secondary = "secondary",
}

type ButtonProps = {
  onClick?: () => void;
  label?: string;
  classname?: string;
  kind?: ButtonKind;
};

const Button = ({
  onClick = () => {},
  label,
  classname,
  kind = ButtonKind.primary,
}: ButtonProps) => {
  return (
    <div className={`${styles.button} ${styles[kind]} ${classname || ""}`}>
      <button onClick={onClick} className={styles.button__action}>
        {label}
      </button>
    </div>
  );
};

export default Button;
