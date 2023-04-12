import { gql, useMutation } from "@apollo/client";

import Card from "../../components/Card";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";
import { updatePicture } from "../../utils/utils";
import EventForm from "./EventForm";
import { Event } from "../../utils/types";

import styles from "./EventUpdate.module.scss";

const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $eventId: Float!
    $title: String!
    $description: String
    $start: String
    $end: String
    $privacy: String
  ) {
    updateEvent(
      eventId: $eventId
      title: $title
      description: $description
      start: $start
      end: $end
      privacy: $privacy
    ) {
      id
      title
      description
      start
      end
      pictureUrl
      privacy
    }
  }
`;

type EventUpdateProps = {
  event: Event;
  onDone: () => void;
};

const EventUpdate = ({ event, onDone }: EventUpdateProps) => {
  const [updateEvent] = useMutation(UPDATE_EVENT, {
    onError: (error) => console.error(error),
    onCompleted: onDone,
  });
  const onSubmit = async (data) => {
    const { picture, ...formData } = data;
    if (picture) {
      await updatePicture(picture, "uploadEventPicture", event.id);
    }
    updateEvent({ variables: { eventId: event.id, ...formData } });
  };

  return (
    <div className={styles["event-update"]}>
      <Card>
        <h1>Update event</h1>
        <EventForm
          event={event}
          onSubmit={onSubmit}
          confirmLabel="Update event"
        />
      </Card>
    </div>
  );
};

export default withPrivateRouteHOC(EventUpdate);
