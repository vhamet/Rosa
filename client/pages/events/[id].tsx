import { useRouter } from "next/router";
import { gql } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { initializeApollo } from "../../services/apollo/apollo-client";
import Head from "next/head";
import Link from "next/link";

import styles from "./[id].module.scss";

const EVENT_QUERY = gql`
  query Event($id: Float!) {
    event(id: $id) {
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
  let event;
  if (context) {
    const apolloClient = initializeApollo({ initialState: null, context });
    try {
      const { data } = await apolloClient.query({
        query: EVENT_QUERY,
        variables: { id: +context.params.id },
      });
      event = data.event;
    } catch (error) {
      const gqlError = error.graphQLErrors[0];
      if (gqlError) {
        console.error({ error });
      }
    }
  }

  return {
    props: {
      event,
    },
  };
};

const EventDetail = ({ event }) => {
  const router = useRouter();
  const id = router.query.id;

  return (
    <div className={styles["view-event"]}>
      <Head>
        <title>{`${event.title} | Rosa`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Link href="/events" className={styles["create-event__back"]}>
        <FontAwesomeIcon icon={faArrowLeft} /> Events
      </Link>

      <div>{event.title}</div>
      <div>{event.description}</div>
    </div>
  );
};

export default EventDetail;
