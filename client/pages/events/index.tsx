import { gql } from "@apollo/client";
import Link from "next/link";
import EventItem from "../../components/events/EventItem";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";
import { initializeApollo } from "../../services/apollo/apollo-client";
import useUserContext from "../../services/authentication/user-context";
import { signout } from "../../services/authentication/utils";
import { ACCESS_TOKEN } from "../../utils/const";
import Cookies from "js-cookie";

const EVENTS_QUERY = gql`
  query {
    events {
      id
      title
      description
      date
      createdBy {
        username
      }
    }
  }
`;

export const getServerSideProps = async (context) => {
  let events = [];
  if (context) {
    const apolloClient = initializeApollo({ initialState: null, context });
    try {
      const { data } = await apolloClient.query({
        query: EVENTS_QUERY,
      });
      events = data.events;
      // Handle what you want to do with this data / Just cache it
    } catch (error) {
      const gqlError = error.graphQLErrors[0];
      if (gqlError) {
        //Handle your error cases
      }
    }
  }

  return {
    props: {
      events,
    },
  };
};

const Events = ({ events }) => {
  const { dispatch } = useUserContext();

  return (
    <>
      <h1>Events list</h1>
      <ul>
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
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
      <input type="button" onClick={() => signout(dispatch)} value="Sign out" />
    </>
  );
};

export default withPrivateRouteHOC(Events);
