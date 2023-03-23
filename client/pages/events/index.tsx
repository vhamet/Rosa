import { gql } from "@apollo/client";
import Head from "next/head";

import EventItem from "../../components/EventItem";
import LinkButton from "../../components/LinkButton";
import Tabs from "../../components/Tabs";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";

import { initializeApollo } from "../../services/apollo/apollo-client";
import { Event } from "../../utils/types";

import styles from "./events.module.scss";

const EVENT_TABS = {
  PAST: "past",
  UPCOMING: "upcoming",
};

export const EVENT_CONTENT_FRAGMENT = gql`
  fragment EventContentFragment on Event {
    id
    title
    description
    start
    end
    createdAt
    createdBy {
      id
      username
    }
    participants {
      id
      username
    }
    comments {
      id
      content
      createdAt
      author {
        id
        username
      }
    }
  }
`;

const PAST_EVENTS_QUERY = gql`
  ${EVENT_CONTENT_FRAGMENT}
  query {
    pastEvents {
      ...EventContentFragment
    }
  }
`;

const UPCOMING_EVENTS_QUERY = gql`
  ${EVENT_CONTENT_FRAGMENT}
  query {
    upcomingEvents {
      ...EventContentFragment
    }
  }
`;

export const getServerSideProps = async (context) => {
  let props = {};
  if (context) {
    const apolloClient = initializeApollo({ initialState: null, context });
    try {
      const fetchUpcoming = context.query?.tab !== EVENT_TABS.PAST;
      const { data } = await apolloClient.query({
        query: fetchUpcoming ? UPCOMING_EVENTS_QUERY : PAST_EVENTS_QUERY,
      });
      if (fetchUpcoming) {
        props = { upcomingEvents: data.upcomingEvents };
      } else {
        props = { pastEvents: data.pastEvents };
      }
    } catch (error) {
      const gqlError = error.graphQLErrors[0];
      if (gqlError) {
        console.error({ error });
      }
    }
  }

  return { props };
};

type EventsProps = {
  pastEvents?: Event[];
  upcomingEvents?: Event[];
};

const Events = ({ upcomingEvents, pastEvents }: EventsProps) => {
  const tabsProps = [
    {
      id: "upcoming",
      title: "Upcoming events",
      content: (
        <div className={styles.events__list}>
          {upcomingEvents?.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      ),
    },
    {
      id: "past",
      title: "Past events",
      content: (
        <div className={styles.events__list}>
          {pastEvents?.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      ),
    },
  ];
  return (
    <div className={styles.events}>
      <Head>
        <title>Events | Rosa</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className={styles.events__header}>
        <LinkButton to="/events/create" label="Create new event" />
      </div>
      <Tabs tabs={tabsProps} />
    </div>
  );
};

export default withPrivateRouteHOC(Events);
