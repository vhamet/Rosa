import { useRouter } from "next/router";

import { fromNow } from "../../utils/dates";
import { EventItemProps } from "../../utils/types";
import Card from "../Card";
import EventDate from "../EventDate";

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
        <EventDate start={start} end={end} />
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
