import { gql, useMutation } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Button from "../../components/Button";
import Card from "../../components/Card";
import FormInput from "../../components/FormInput";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";
import ImageInput, { ImageInputSize } from "../../components/ImageInput";
import { updatePicture } from "../../utils/utils";

import styles from "./create.module.scss";

const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String
    $start: String
    $end: String
    $pictureUrl: String
  ) {
    createEvent(
      title: $title
      description: $description
      start: $start
      end: $end
      pictureUrl: $pictureUrl
    ) {
      id
      title
      description
      start
      end
      pictureUrl
      createdAt
      createdBy {
        id
        username
      }
    }
  }
`;

const NewEvent = () => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const watchStart = watch("start");

  const [createEvent] = useMutation(CREATE_EVENT, {
    onError: (error) => console.error(error),
    onCompleted: (data) =>
      router.push(`/events/${data.createEvent.id}`, null, { shallow: true }),
  });
  const onSubmit = async (data) => {
    const { picture, ...formData } = data;
    let pictureUrl;
    if (picture) {
      pictureUrl = await updatePicture(picture, "uploadEventPicture");
    }
    createEvent({ variables: { ...formData, pictureUrl } });
  };

  return (
    <div className={styles["create-event"]}>
      <Head>
        <title>New event | Rosa</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div
        onClick={() => router.push("/events")}
        className={`${styles["create-event__back"]} link`}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Events
      </div>

      <Card>
        <h1>New event</h1>
        <form
          className={styles["create-event__form"]}
          onSubmit={handleSubmit(onSubmit)}
        >
          <ImageInput
            name="picture"
            setValue={setValue}
            size={ImageInputSize.xlarge}
          />
          <FormInput
            name="title"
            label="Title"
            error={errors.title}
            register={register}
            options={{ required: true }}
          />
          <FormInput
            name="description"
            label="Description"
            error={errors.description}
            register={register}
            type="textarea"
          />
          <FormInput
            name="start"
            label="Start date"
            error={errors.start}
            control={control}
            type="date"
            defaultValue={new Date()}
            minDate={new Date()}
            withTime
          />
          <FormInput
            name="end"
            label="End date"
            error={errors.end}
            control={control}
            type="date"
            defaultValue={watchStart}
            minDate={watchStart || new Date()}
            withTime
          />
          <Button label="Create event" />
        </form>
      </Card>
    </div>
  );
};

export default withPrivateRouteHOC(NewEvent);
