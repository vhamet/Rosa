import { gql } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import EventItem from "../../components/EventItem";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";
import { initializeApollo } from "../../services/apollo/apollo-client";

import styles from "./events.module.scss";

const EVENTS_QUERY = gql`
  query {
    events {
      id
      title
      description
      start
      end
      createdAt
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
    <div className={styles.events}>
      <Head>
        <title>Events | Rosa</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className={styles.events__header}>
        <h1>Upcoming events</h1>
        <Link href="/events/create">Create new event</Link>
      </div>
      <div>
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default withPrivateRouteHOC(Events);
