import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { formatEventDate } from "../../utils/dates";

import styles from "./EventDate.module.scss";

type EventDateProps = {
  start?: string;
  end?: string;
};

const EventDate = ({ start, end }: EventDateProps) => {
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
    <div className={styles["event-date"]}>
      <FontAwesomeIcon icon={faCalendar} />
      {date}
    </div>
  );
};

export default EventDate;
