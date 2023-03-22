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
  },
}: EventItemProps) => {
  const router = useRouter();

  return (
    <Card onClick={() => router.push(`/events/${id}`, null, { shallow: true })}>
      <div className={styles["event-item"]}>
        <EventDate start={start} end={end} />
        <div className={styles["event-item__title"]}>{title}</div>
        <div className={styles["event-item__description"]}>{description}</div>
        <div className={styles["event-item__information"]}>
          Created by {username} {fromNow(createdAt)}
        </div>
      </div>
    </Card>
  );
};

export default EventItem;
