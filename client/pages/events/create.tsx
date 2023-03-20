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

import styles from "./create.module.scss";
import Link from "next/link";

const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String
    $start: String
    $end: String
  ) {
    createEvent(
      title: $title
      description: $description
      start: $start
      end: $end
    ) {
      id
      title
      description
      start
      end
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
  } = useForm();
  const watchStart = watch("start");

  const [createEvent] = useMutation(CREATE_EVENT, {
    onError: (error) => console.error(error),
    onCompleted: (data) =>
      router.push(`/events/${data.createEvent.id}`, null, { shallow: true }),
  });
  const onSubmit = (formData) => createEvent({ variables: formData });

  return (
    <div className={styles["create-event"]}>
      <Head>
        <title>New event | Rosa</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Link href="/events" className={styles["create-event__back"]}>
        <FontAwesomeIcon icon={faArrowLeft} /> Events
      </Link>

      <Card>
        <h1>New event</h1>
        <form
          className={styles["create-event__form"]}
          onSubmit={handleSubmit(onSubmit)}
        >
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
