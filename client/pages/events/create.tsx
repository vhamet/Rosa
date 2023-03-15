import { gql, useMutation } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import FormInput from "../../components/Form/FormInput";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";

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
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [createEvent] = useMutation(CREATE_EVENT, {
    onError: (error) => console.error(error),
    onCompleted: (data) => router.push(`/events/${data.createEvent.id}`),
  });
  const onSubmit = (formData) => createEvent({ variables: formData });

  return (
    <div className="new-event">
      <Head>
        <title>New event | Rosa</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1>New event</h1>

      <form className="new-event__form" onSubmit={handleSubmit(onSubmit)}>
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
        />
        <FormInput
          name="start"
          label="Start date"
          error={errors.start}
          register={register}
        />
        <FormInput
          name="end"
          label="End date"
          error={errors.end}
          register={register}
        />
        <input type="submit" value="Create event" />
      </form>
    </div>
  );
};

export default withPrivateRouteHOC(NewEvent);
