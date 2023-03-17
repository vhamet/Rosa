import { useForm } from "react-hook-form";
import Button from "../Button";
import FormInput from "../FormInput";

import styles from "./AuthenticationForm.module.scss";

const AuthenticationForm = ({ onSubmit, actionLabel = "Confirm" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      className={styles["authentication-form"]}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        name="username"
        label="Username"
        error={errors.username}
        register={register}
        options={{ required: true }}
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        error={errors.password}
        register={register}
        options={{ required: true }}
      />
      <Button label={actionLabel} />
    </form>
  );
};

export default AuthenticationForm;
