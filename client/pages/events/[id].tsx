import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";

import { initializeApollo } from "../../services/apollo/apollo-client";

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

// export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
//   return {
//     paths: [], //indicates that no page needs be created at build time
//     fallback: "blocking", //indicates the type of fallback
//   };
//};

const EventDetail = ({ event }) => {
  const router = useRouter();
  const id = router.query.id;

  return (
    <>
      <h1>Event {id}</h1>
      {event.title}
    </>
  );
};

export default EventDetail;
