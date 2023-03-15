import {
  UseFormRegister,
  FieldValues,
  FieldError,
  Merge,
  FieldErrorsImpl,
  RegisterOptions,
} from "react-hook-form";

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
    <div className="form-input">
      {label && <label>{label}</label>}
      <input type={type || "text"} {...register(name, options)} />
      {error && (
        <span>{error.message.toString() || "This field is required"}</span>
      )}
    </div>
  );
};
export default FormInput;
