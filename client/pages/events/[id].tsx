import { useRouter } from "next/router";
import Head from "next/head";
import jwtDecode from "jwt-decode";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUserPlus,
  faUserMinus,
} from "@fortawesome/free-solid-svg-icons";

import {
  initializeApollo,
  addApolloState,
} from "../../services/apollo/apollo-client";
import Card from "../../components/Card";
import EventDate from "../../components/EventDate";
import { fromNow } from "../../utils/dates";
import UserTag from "../../components/UserTag";
import IconButton from "../../components/IconButton";
import { ACCESS_TOKEN } from "../../utils/const";
import Tag from "../../components/Tag";
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

const PARTICIPATE_MUTATION = gql`
  mutation Participate($eventId: Float!) {
    participate(eventId: $eventId) {
      id
      username
    }
  }
`;

const CANCEL_PARTICIPATION_MUTATION = gql`
  mutation CancelParticipation($eventId: Float!) {
    cancelParticipation(eventId: $eventId) {
      id
      username
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

  const [participate] = useMutation(PARTICIPATE_MUTATION, {
    variables: { eventId: id },
    update: (cache, { data: { participate } }) => {
      if (participate) {
        cache.modify({
          id: cache.identify(data?.event),
          fields: {
            participants(cachedParticipants) {
              return [...cachedParticipants, participate];
            },
          },
        });
      }
    },
  });
  const onParticipate = () => participate();
  const [cancelParticipation] = useMutation(CANCEL_PARTICIPATION_MUTATION, {
    variables: { eventId: id },
    update: (cache, { data: { cancelParticipation } }) => {
      if (cancelParticipation) {
        cache.modify({
          id: cache.identify(data?.event),
          fields: {
            participants(cachedParticipants, { readField }) {
              return cachedParticipants.filter(
                (participantRef) =>
                  cancelParticipation.id !== readField("id", participantRef)
              );
            },
          },
        });
      }
    },
  });
  const onCancelParticipation = () => cancelParticipation();

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
      participants,
      createdAt,
      createdBy: { username },
    },
  } = data;
  const hasParticipants = participants.length > 0;

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

        <div className={styles["view-event__participants"]}>
          <div className={styles["view-event__participants__title"]}>
            Participants
            <label className={styles["view-event__participants__count"]}>
              {hasParticipants && `(${participants.length})`}
            </label>
          </div>
          <div className={styles["view-event__participants__container"]}>
            {hasParticipants ? (
              participants.map((user) => (
                <UserTag
                  key={user.id}
                  user={user}
                  onClick={user.id === auth.id && cancelParticipation}
                />
              ))
            ) : (
              <div className={styles["view-event__participants__empty"]}>
                No participant yet...
              </div>
            )}
            {participants.every(({ id }) => auth.id !== id) && (
              <Tag
                onClick={onParticipate}
                className={styles["view-event__participate"]}
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Participate
              </Tag>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventDetail;
