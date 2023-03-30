import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import jwtDecode from "jwt-decode";
import { gql, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import {
  initializeApollo,
  addApolloState,
} from "../../services/apollo/apollo-client";
import { ACCESS_TOKEN } from "../../utils/const";
import { EVENT_CONTENT_FRAGMENT } from ".";
import { AuthenticationType } from "../../services/authentication/user-context";
import { Event } from "../../utils/types";
import EventDetail from "./EventDetail";
import EventUpdate from "./EventUpdate";

import styles from "./[id].module.scss";

const EVENT_QUERY = gql`
  ${EVENT_CONTENT_FRAGMENT}
  query Event($id: Float!) {
    event(id: $id) {
      ...EventContentFragment
    }
  }
`;

export const getServerSideProps = async (context) => {
  let event, auth: AuthenticationType;
  if (context) {
    const apolloClient = initializeApollo({ context });
    try {
      const { data } = await apolloClient.query({
        query: EVENT_QUERY,
        variables: { id: +context.params.id },
      });
      event = data?.event;
    } catch (error) {
      const gqlError = error.graphQLErrors?.[0];
      if (gqlError) {
        console.error({ error });
      }
    }

    const token = context.req?.cookies?.[ACCESS_TOKEN];
    auth = token && jwtDecode(token);

    return addApolloState(apolloClient, { props: { event, auth } });
  }
};

type EventProps = {
  auth: AuthenticationType;
};

const Event = ({ auth }: EventProps) => {
  const router = useRouter();
  const id = +router.query.id;
  const { loading, error, data } = useQuery(EVENT_QUERY, {
    variables: { id },
  });

  const [updating, setUpdating] = useState(false);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error !</p>;
  }

  const event: Event = data.event;

  return (
    <div className={styles["view-event"]}>
      <Head>
        <title>{`${data?.event.title} | Rosa`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div
        onClick={() => router.push("/events")}
        className={`${styles["view-event__back"]} link`}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Events
      </div>

      {updating ? (
        <EventUpdate event={event} onDone={() => setUpdating(false)} />
      ) : (
        <EventDetail
          onUpdating={() => setUpdating(true)}
          event={event}
          auth={auth}
        />
      )}
    </div>
  );
};

export default Event;
