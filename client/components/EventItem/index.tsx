import { useRouter } from "next/router";
import { formatDate, formatEventDate } from "../../utils/dates";
import Card from "../Card";

import styles from "./EventItem.module.scss";

type Event = {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string;
  createdAt: string;
  createdBy: { username: string };
};

type EvenItemtProps = { event: Event };

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
}: EvenItemtProps) => {
  const router = useRouter();

  console.log({ start, end });
  let date;
  if (!start && !end) {
    date = "TDB";
  } else if (!end) {
    date = formatEventDate(start);
  } else {
    date = (
      <>
        {formatEventDate(start)} <label>to</label> {formatEventDate(end)}
      </>
    );
  }

  return (
    <Card onClick={() => router.push(`/events/${id}`, null, { shallow: true })}>
      <div className={styles["event-item"]}>
        <div className={styles["event-item__date"]}>{date}</div>
        <div className={styles["event-item__title"]}>{title}</div>
        <div className={styles["event-item__description"]}>{description}</div>
        <div className={styles["event-item__information"]}>
          Created by {username} on {formatDate(createdAt)}
        </div>
      </div>
    </Card>
  );
};

export default EventItem;
