import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import UserTag from "../../components/UserTag";
import Tag from "../../components/Tag";
import { Event } from "../../utils/types";

import styles from "./Participants.module.scss";

const PARTICIPATE_MUTATION = gql`
  mutation Participate($eventId: Float!) {
    participate(eventId: $eventId) {
      id
      username
    }
  }
`;

const CANCEL_PARTICIPATION_MUTATION = gql`
  mutation CancelParticipation($eventId: Float!) {
    cancelParticipation(eventId: $eventId) {
      id
      username
    }
  }
`;

type ParticipantsProps = {
  event: Event;
  loggedId: number;
  eventOver: boolean;
};

const Participants = ({ event, loggedId, eventOver }: ParticipantsProps) => {
  const { participants } = event;

  const [participate] = useMutation(PARTICIPATE_MUTATION, {
    variables: { eventId: event.id },
    update: (cache, { data: { participate } }) => {
      if (participate) {
        cache.modify({
          id: cache.identify(event),
          fields: {
            participants(cachedParticipants) {
              return [...cachedParticipants, participate];
            },
          },
        });
      }
    },
  });

  const [cancelParticipation] = useMutation(CANCEL_PARTICIPATION_MUTATION, {
    variables: { eventId: event.id },
    update: (cache, { data: { cancelParticipation } }) => {
      if (cancelParticipation) {
        cache.modify({
          id: cache.identify(event),
          fields: {
            participants(cachedParticipants, { readField }) {
              return cachedParticipants.filter(
                (participantRef) =>
                  cancelParticipation.id !== readField("id", participantRef)
              );
            },
          },
        });
      }
    },
  });

  const hasParticipants = participants.length > 0;

  return (
    <div className={styles["participants"]}>
      <div className={styles["participants__title"]}>
        Participants
        <label className={styles["participants__count"]}>
          {hasParticipants && `(${participants.length})`}
        </label>
      </div>
      <div className={styles["participants__container"]}>
        {hasParticipants ? (
          participants.map((user) => (
            <UserTag
              key={user.id}
              user={user}
              onClick={
                !eventOver && user.id === loggedId && cancelParticipation
              }
            />
          ))
        ) : (
          <div className={styles["participants__empty"]}>
            No participant yet...
          </div>
        )}
        {!eventOver && participants.every(({ id }) => loggedId !== id) && (
          <Tag onClick={participate} className={styles["participate"]}>
            <FontAwesomeIcon icon={faUserPlus} />
            Participate
          </Tag>
        )}
      </div>
    </div>
  );
};

export default Participants;
