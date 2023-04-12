import { useState } from "react";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPenToSquare,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";

import Button, { ButtonKind } from "../../components/Button";
import IconButton, {
  IconButtonKind,
  IconButtonSize,
} from "../../components/IconButton";
import Modal from "../../components/Modal";
import Participants from "./Participants";
import Comments from "./Comments";
import Card from "../../components/Card";
import EventDate from "../../components/EventDate";
import { fromNow } from "../../utils/dates";
import { capitalize, isEventOver } from "../../utils/utils";
import { Event, User } from "../../utils/types";
import { Privacy, Role } from "../../utils/const";

import styles from "./EventDetail.module.scss";

const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEvent($eventId: Float!) {
    deleteEvent(eventId: $eventId)
  }
`;

type EventDetailProps = {
  event: Event;
  currentUser: User;
  onUpdating: () => void;
};

const EventDetail = ({ event, currentUser, onUpdating }: EventDetailProps) => {
  const router = useRouter();
  const {
    id,
    title,
    description,
    start,
    end,
    comments,
    pictureUrl,
    privacy,
    createdAt,
    createdBy: { id: createdBy, username },
  } = event;

  const [deleting, setDeleting] = useState(false);
  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION, {
    variables: { eventId: id },
    onCompleted: () => router.push("/events"),
    update: (cache) => {
      const normalizedId = cache.identify({ id, __typename: "Event" });
      cache.evict({ id: normalizedId });
      cache.gc();
    },
  });

  return (
    <>
      <Card className={styles["event-detail__card"]}>
        <img
          src={
            pictureUrl
              ? `${process.env.NEXT_PUBLIC_URL_SERVER}${pictureUrl}`
              : "/sou.jpeg"
          }
          alt={title}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "sou.jpeg";
          }}
        />
        <div className={styles["event-detail__header"]}>
          <EventDate start={start} end={end} />
          <div className={styles["event-detail__information"]}>
            Created by {username} {fromNow(createdAt)}
          </div>
        </div>
        <div className={styles["event-detail__title"]}>
          {title}
          {
            <FontAwesomeIcon
              icon={privacy === Privacy.PUBLIC ? faLockOpen : faLock}
            />
          }
          <label>{capitalize(privacy)}</label>
        </div>
        <div className={styles["event-detail__description"]}>{description}</div>

        <Participants
          event={event}
          loggedId={currentUser.id}
          eventOver={isEventOver(start, end)}
        />

        <Comments event={event} comments={comments} loggedUser={currentUser} />

        {currentUser.id === createdBy ||
          (currentUser.role === Role.ADMIN && (
            <div className={styles["event-detail__actions"]}>
              <IconButton
                icon={faPenToSquare}
                size={IconButtonSize.medium}
                onClick={onUpdating}
                withBackground
              />
              <IconButton
                icon={faTrash}
                size={IconButtonSize.medium}
                kind={IconButtonKind.danger}
                onClick={() => setDeleting(true)}
                withBackground
              />
            </div>
          ))}
      </Card>
      <Modal visible={deleting} onClose={() => setDeleting(false)}>
        <div className={styles["event-detail__modal"]}>
          <div>Delete event</div>
          <div>
            Are you sure you want to delete this event ? This action is
            irreversible !
          </div>
          <div className={styles["event-detail__modal__actions"]}>
            <Button
              kind={ButtonKind.secondary}
              onClick={() => setDeleting(false)}
              label="Cancel"
            />
            <Button
              kind={ButtonKind.danger}
              onClick={deleteEvent}
              label="Confirm"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EventDetail;
