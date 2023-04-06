import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";

import EventDate from "../EventDate";
import Card from "../Card";
import { fromNow } from "../../utils/dates";
import { EventItemProps } from "../../utils/types";
import { Privacy } from "../../utils/const";
import { capitalize } from "../../utils/utils";

import styles from "./EventItem.module.scss";

const EventItem = ({
  event: {
    id,
    title,
    description,
    start,
    end,
    createdAt,
    createdBy: { username },
    participants,
    comments,
    pictureUrl,
    privacy,
  },
}: EventItemProps) => {
  const router = useRouter();

  return (
    <Card onClick={() => router.push(`/events/${id}`, null, { shallow: true })}>
      <div className={styles["event-item"]}>
        <img
          src={
            pictureUrl
              ? `${process.env.NEXT_PUBLIC_URL_SERVER}${pictureUrl}`
              : "sou.jpeg"
          }
          alt={title}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "sou.jpeg";
          }}
        />
        <div className={styles["event-item__header"]}>
          <EventDate start={start} end={end} />
          {
            <FontAwesomeIcon
              icon={privacy === Privacy.PUBLIC ? faLockOpen : faLock}
            />
          }
          <label>{capitalize(privacy)}</label>
        </div>
        <div className={styles["event-item__title"]}>{title}</div>
        <div className={styles["event-item__description"]}>{description}</div>
        <div className={styles["event-item__information"]}>
          <div>
            {participants.length} participants - {comments.length} comment
          </div>
          <div>
            Created by {username} {fromNow(createdAt)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventItem;
