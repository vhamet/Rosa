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
import Card from "../../components/Card";
import EventDate from "../../components/EventDate";
import { fromNow } from "../../utils/dates";
import { isEventOver } from "../../utils/utils";
import { ACCESS_TOKEN } from "../../utils/const";
import Participants from "./Participants";
import Comments from "./Comments";
import { EVENT_CONTENT_FRAGMENT } from ".";

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
  let event, auth;
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

const EventDetail = ({ auth }) => {
  const router = useRouter();
  const id = +router.query.id;
  const { loading, error, data } = useQuery(EVENT_QUERY, {
    variables: { id },
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error !</p>;
  }

  const {
    event: {
      title,
      description,
      start,
      end,
      comments,
      createdAt,
      createdBy: { username },
    },
  } = data;

  return (
    <div className={styles["view-event"]}>
      <Head>
        <title>{`${title} | Rosa`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div
        onClick={() => router.push("/events")}
        className={`${styles["view-event__back"]} link`}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Events
      </div>

      <Card classnames={styles["view-event__card"]}>
        <div className={styles["view-event__header"]}>
          <EventDate start={start} end={end} />
          <div className={styles["view-event__information"]}>
            Created by {username} {fromNow(createdAt)}
          </div>
        </div>
        <div className={styles["view-event__title"]}>{title}</div>
        <div className={styles["view-event__description"]}>{description}</div>

        <Participants
          event={data?.event}
          loggedId={auth.id}
          eventOver={isEventOver(start, end)}
        />

        <Comments event={data?.event} comments={comments} loggedUser={auth} />
      </Card>
    </div>
  );
};

export default EventDetail;
