import {
  UseFormRegister,
  FieldValues,
  FieldError,
  Merge,
  FieldErrorsImpl,
  RegisterOptions,
  Control,
  UseFormSetValue,
} from "react-hook-form";
import DateInput from "../DateInput";
import { DropdownOption, RequireOnlyOne } from "../../utils/types";

import styles from "./FormInput.module.scss";
import ColorInput from "../ColorInput";
import DropdownInput from "../DropdownInput";

enum FormInputType {
  textarea,
  date,
  color,
  dropdown,
}

interface FormInputInterface {
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  type?: FormInputType | string;
  register: UseFormRegister<FieldValues>;
  control?: Control<FieldValues, any>;
  options?: RegisterOptions;
  setValue?: UseFormSetValue<FieldValues>;
  defaultValue?: any;
  minDate?: Date;
  withTime?: boolean;
  dropdownOptions?: DropdownOption[];
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
  setValue,
  defaultValue,
  minDate,
  withTime,
  dropdownOptions,
}: FormInputProps) => {
  let input;
  switch (type) {
    case "textarea":
      input = (
        <textarea
          defaultValue={defaultValue}
          {...register(name, options)}
          placeholder={placeholder}
        />
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
    case "color":
      input = (
        <ColorInput
          name={name}
          register={register}
          defaultValue={defaultValue}
          options={options}
          setValue={setValue}
        />
      );
      break;
    case "dropdown":
      input = (
        <DropdownInput
          name={name}
          control={control}
          defaultValue={defaultValue}
          options={dropdownOptions}
        />
      );
      break;
    default:
      input = (
        <input
          type={type?.toString() || "text"}
          {...register(name, options)}
          placeholder={placeholder}
          defaultValue={defaultValue}
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
