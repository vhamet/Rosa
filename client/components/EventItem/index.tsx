type Event = {
  id: number;
  title: string;
  description?: string;
  date: string;
  createdBy: { username: string };
};

type EvenItemtProps = { event: Event };

const EventItem = ({
  event: {
    id,
    title,
    description,
    date,
    createdBy: { username },
  },
}: EvenItemtProps) => {
  return (
    <div className="event-item">
      <div>
        {title} by {username}
      </div>
      <div>{description}</div>
      <div>on {date}</div>
    </div>
  );
};

export default EventItem;
