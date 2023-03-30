import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import jwtDecode from "jwt-decode";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

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
import IconButton, {
  IconButtonKind,
  IconButtonSize,
} from "../../components/IconButton";
import Modal from "../../components/Modal";

import styles from "./[id].module.scss";
import Button, { ButtonKind } from "../../components/Button";

const EVENT_QUERY = gql`
  ${EVENT_CONTENT_FRAGMENT}
  query Event($id: Float!) {
    event(id: $id) {
      ...EventContentFragment
    }
  }
`;

const DELETE_EVENT_MUTATION = gql`
  mutation DeleteEvent($eventId: Float!) {
    deleteEvent(eventId: $eventId)
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

  const [deleting, setDeleting] = useState(false);
  const [deleteEvent] = useMutation(DELETE_EVENT_MUTATION, {
    variables: { eventId: id },
    onCompleted: () => router.push("/events"),
    update: (cache) => {
      const normalizedId = cache.identify({ id, __typename: "Event" });
      cache.evict({ id: normalizedId });
      cache.gc();
    },
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
      pictureUrl,
      createdAt,
      createdBy: { id: createdBy, username },
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

      <Card className={styles["view-event__card"]}>
        <img
          src={
            pictureUrl
              ? `${process.env.NEXT_PUBLIC_URL_SERVER}${pictureUrl}`
              : "/sou.jpeg"
          }
          alt={title}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "sou.jpeg";
          }}
        />
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

        {auth.id === createdBy && (
          <div className={styles["view-event__actions"]}>
            <IconButton
              icon={faPenToSquare}
              size={IconButtonSize.medium}
              onClick={() => {}}
              withBackground
            />
            <IconButton
              icon={faTrash}
              size={IconButtonSize.medium}
              kind={IconButtonKind.danger}
              onClick={() => setDeleting(true)}
              withBackground
            />
          </div>
        )}
      </Card>
      <Modal visible={deleting} onClose={() => setDeleting(false)}>
        <div className={styles["view-event__modal"]}>
          <div>Delete event</div>
          <div>
            Are you sure you want to delete this event ? This action is
            irreversible !
          </div>
          <div className={styles["view-event__modal__actions"]}>
            <Button
              kind={ButtonKind.secondary}
              onClick={() => setDeleting(false)}
              label="Cancel"
            />
            <Button
              kind={ButtonKind.danger}
              onClick={deleteEvent}
              label="Confirm"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetail;
