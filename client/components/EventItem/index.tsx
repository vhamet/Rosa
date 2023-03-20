import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

import { formatEventDate, fromNow } from "../../utils/dates";
import Card from "../Card";

import styles from "./EventItem.module.scss";

export type Event = {
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

  let date;
  if (!start && !end) {
    date = "TBD";
  } else if (!end) {
    date = formatEventDate(start);
  } else {
    date = (
      <>
        {formatEventDate(start)} <label>to&nbsp;</label> {formatEventDate(end)}
      </>
    );
  }

  return (
    <Card onClick={() => router.push(`/events/${id}`, null, { shallow: true })}>
      <div className={styles["event-item"]}>
        <div className={styles["event-item__date"]}>
          <FontAwesomeIcon icon={faCalendar} />
          {date}
        </div>
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
