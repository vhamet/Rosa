import { useForm } from "react-hook-form";
import FormInput from "./Form/FormInput";

const AuthenticationForm = ({ onSubmit, actionLabel = "Confirm" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
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
      <button>Sign in !</button>
    </form>
  );
};

export default AuthenticationForm;
