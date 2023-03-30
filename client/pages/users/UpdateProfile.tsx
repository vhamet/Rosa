import { useForm } from "react-hook-form";

import Button, { ButtonKind } from "../../components/Button";
import FormInput from "../../components/FormInput";
import ImageInput, {
  ImageInputSize,
  ImageInputStyle,
} from "../../components/ImageInput";
import { User } from "../../utils/types";
import { ProfileData } from "./[id]";

import styles from "./[id].module.scss";

type UpdateProfileProps = {
  user: User;
  onConfirm: (formData: ProfileData) => void;
  onCancel: () => void;
};

const UpdateProfile = ({ user, onConfirm, onCancel }: UpdateProfileProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  return (
    <form
      className={styles["update-profile"]}
      onSubmit={handleSubmit(onConfirm)}
    >
      <div className={styles["update-profile__image"]}>
        <ImageInput
          name="picture"
          pictureUrl={
            user.pictureUrl &&
            `${process.env.NEXT_PUBLIC_URL_SERVER}${user.pictureUrl}`
          }
          setValue={setValue}
          size={ImageInputSize.xlarge}
          style={ImageInputStyle.round}
        />
      </div>
      <FormInput
        name="username"
        label="Username"
        error={errors.username}
        defaultValue={user.username}
        register={register}
        options={{ required: true }}
      />
      <FormInput
        name="phone"
        label="Phone number"
        defaultValue={user.phone}
        error={errors.phone}
        register={register}
      />
      <FormInput
        name="color"
        label="Your color"
        type="color"
        defaultValue={user.color}
        error={errors.color}
        register={register}
        setValue={setValue}
      />
      <div className={styles["update-profile__actions"]}>
        <Button kind={ButtonKind.secondary} onClick={onCancel} label="Cancel" />
        <Button label="Save" />
      </div>
    </form>
  );
};

export default UpdateProfile;
