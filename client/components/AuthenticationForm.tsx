import { useForm } from "react-hook-form";

const AuthenticationForm = ({ onSubmit, actionLabel = "Confirm" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username", { required: true })} />
      {errors.username && <span>This field is required</span>}
      <input type="password" {...register("password", { required: true })} />
      {errors.password && <span>This field is required</span>}
      <input type="submit" value={actionLabel} />
    </form>
  );
};

export default AuthenticationForm;
