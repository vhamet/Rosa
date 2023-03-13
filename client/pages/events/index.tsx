import { gql } from "@apollo/client";
import EventItem from "../../components/events/EventItem";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";
import { initializeApollo } from "../../services/apollo/apollo-client";

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
    } catch (error) {
      const gqlError = error.graphQLErrors[0];
      if (gqlError) {
        console.error({ error });
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
  return (
    <>
      <h1>Events list</h1>
      <div>
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </>
  );
};

export default withPrivateRouteHOC(Events);
