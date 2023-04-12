import { useForm } from "react-hook-form";

import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import ImageInput, { ImageInputSize } from "../../components/ImageInput";
import { Event } from "../../utils/types";
import { PRIVACY_OPTIONS } from "../../utils/const";

import styles from "./EventForm.module.scss";

type EventFormData = {
  title: string;
  description: string;
  start: string;
  end: string;
  picture: File;
};

type EventFormProps = {
  onSubmit: (formData: EventFormData) => void;
  event?: Event;
  confirmLabel?: string;
};

const EventForm = ({ event, onSubmit, confirmLabel }: EventFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const watchStart = watch("start");

  return (
    <form className={styles["event-form"]} onSubmit={handleSubmit(onSubmit)}>
      <ImageInput
        name="picture"
        setValue={setValue}
        size={ImageInputSize.xlarge}
        pictureUrl={event?.pictureUrl}
      />
      <FormInput
        name="title"
        label="Title"
        error={errors.title}
        register={register}
        options={{ required: true }}
        defaultValue={event?.title}
      />
      <FormInput
        name="description"
        label="Description"
        error={errors.description}
        register={register}
        type="textarea"
        defaultValue={event?.description}
      />
      <FormInput
        name="start"
        label="Start date"
        error={errors.start}
        control={control}
        type="date"
        defaultValue={
          event?.start ? new Date(parseInt(event.start)) : new Date()
        }
        minDate={new Date()}
        withTime
      />
      <FormInput
        name="end"
        label="End date"
        error={errors.end}
        control={control}
        type="date"
        defaultValue={
          watchStart || (event?.end ? new Date(parseInt(event.end)) : null)
        }
        minDate={watchStart || new Date()}
        withTime
      />
      <FormInput
        name="privacy"
        label="Privacy"
        error={errors.privacy}
        control={control}
        type="dropdown"
        dropdownOptions={PRIVACY_OPTIONS}
      />
      <Button label={confirmLabel || "Confirm"} />
    </form>
  );
};

export default EventForm;
