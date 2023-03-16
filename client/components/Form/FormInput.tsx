import {
  UseFormRegister,
  FieldValues,
  FieldError,
  Merge,
  FieldErrorsImpl,
  RegisterOptions,
} from "react-hook-form";

import styles from "./FormInput.module.scss";

type FormInputProps = {
  name: string;
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  type?: string;
  register: UseFormRegister<FieldValues>;
  options?: RegisterOptions;
};

const FormInput = ({
  name,
  label,
  error,
  type,
  register,
  options,
}: FormInputProps) => {
  return (
    <div
      className={`${styles["form-input"]} ${
        error ? styles["form-input__error"] : ""
      }`}
    >
      <div className={styles["form-input__labels"]}>
        {label && <label>{label}</label>}
        {error && (
          <span>{error.message.toString() || "This field is required"}</span>
        )}
      </div>
      <input type={type || "text"} {...register(name, options)} />
    </div>
  );
};
export default FormInput;
