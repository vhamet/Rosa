import { gql, useMutation } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Card from "../../components/Card";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";
import { updatePicture } from "../../utils/utils";

import styles from "./create.module.scss";
import EventForm from "./EventForm";

const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String
    $start: String
    $end: String
    $pictureUrl: String
    $privacy: String
  ) {
    createEvent(
      title: $title
      description: $description
      start: $start
      end: $end
      pictureUrl: $pictureUrl
      privacy: $privacy
    ) {
      id
      title
      description
      start
      end
      pictureUrl
      privacy
      createdAt
      createdBy {
        id
        username
      }
    }
  }
`;

const CreateEvent = () => {
  const router = useRouter();

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
        <title>Create event | Rosa</title>
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
        <EventForm onSubmit={onSubmit} confirmLabel="Create event" />
      </Card>
    </div>
  );
};

export default withPrivateRouteHOC(CreateEvent);
