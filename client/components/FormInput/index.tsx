import {
  UseFormRegister,
  FieldValues,
  FieldError,
  Merge,
  FieldErrorsImpl,
  RegisterOptions,
  Control,
} from "react-hook-form";
import DateInput from "../DateInput";
import { RequireOnlyOne } from "../../utils/types";

import styles from "./FormInput.module.scss";

interface FormInputInterface {
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  type?: string;
  register: UseFormRegister<FieldValues>;
  control?: Control<FieldValues, any>;
  options?: RegisterOptions;
  defaultValue?: any;
  minDate?: Date;
  withTime?: boolean;
}

type FormInputProps = RequireOnlyOne<
  FormInputInterface,
  "register" | "control"
>;

const FormInput = ({
  name,
  label,
  placeholder,
  error,
  type,
  register,
  control,
  options,
  defaultValue,
  minDate,
  withTime,
}: FormInputProps) => {
  let input;
  switch (type) {
    case "textarea":
      input = (
        <textarea {...register(name, options)} placeholder={placeholder} />
      );
      break;
    case "date":
      input = (
        <DateInput
          name={name}
          control={control}
          defaultValue={defaultValue}
          minDate={minDate}
          withTime={withTime}
        />
      );
      break;
    default:
      input = (
        <input
          type={type || "text"}
          {...register(name, options)}
          placeholder={placeholder}
        />
      );
      break;
  }

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
      {input}
    </div>
  );
};
export default FormInput;
