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
import { Event, User } from "../../utils/types";
import EventDetail from "./EventDetail";
import EventUpdate from "./EventUpdate";
import { USER_QUERY } from "../users/[id]";
import { AuthenticationType } from "../../services/authentication/user-context";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";

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
  let event, currentUser: User;
  if (context) {
    const apolloClient = initializeApollo({ context });
    try {
      const { data } = await apolloClient.query({
        query: EVENT_QUERY,
        variables: { id: +context.params.id },
      });
      event = data?.event || null;

      const token = context.req?.cookies?.[ACCESS_TOKEN];
      const auth: AuthenticationType = token && jwtDecode(token);
      const { data: userData } = await apolloClient.query({
        query: USER_QUERY,
        variables: { id: auth.id },
      });
      currentUser = userData.user;
    } catch (error) {
      const gqlError = error.graphQLErrors?.[0];
      if (gqlError?.extensions?.code === "FORBIDDEN") {
        return {
          redirect: {
            permanent: false,
            destination: "/signin",
          },
          props: {},
        };
      }
    }

    return addApolloState(apolloClient, { props: { event, currentUser } });
  }
};

type EventProps = {
  currentUser: User;
};

const Event = ({ currentUser }: EventProps) => {
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
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default withPrivateRouteHOC(Event);
