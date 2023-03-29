import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Button, { ButtonKind } from "../../components/Button";
import FormInput from "../../components/FormInput";
import UserAvatar, { AvatarSize } from "../../components/UserAvatar";
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

  const [picture, setPicture] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const handlePictureSelection = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setPicture(undefined);
      setValue("picture", "");
      return;
    }

    setPicture(event.target.files[0]);
    setValue("picture", event.target.files[0]);
  };

  useEffect(() => {
    if (!picture) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(picture);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [picture]);

  return (
    <form
      className={styles["update-profile"]}
      onSubmit={handleSubmit(onConfirm)}
    >
      <div className={styles["update-profile__image"]}>
        <UserAvatar preview={preview} user={user} size={AvatarSize.xlarge} />
        <input
          type="file"
          className={styles["update-profile__file"]}
          onChange={handlePictureSelection}
          accept="image/png, image/gif, image/jpeg"
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
