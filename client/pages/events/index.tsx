import Link from "next/link";

const Events = () => {
  return (
    <>
      <h1>Events list</h1>
      <ul>
        <li>
          <Link href="/events/1">Matt goodbye</Link>
        </li>
        <li>
          <Link href="/events/2">Barathon</Link>
        </li>
        <li>
          <Link href="/events/3">Party</Link>
        </li>
      </ul>
    </>
  );
};

export default Events;
