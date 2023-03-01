import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";

import client from "../../apollo-client";

const QUERY = gql`
  query Welcome {
    welcome
  }
`;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({
    query: QUERY,
  });

  return {
    props: {
      welcome: data.welcome,
    },
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

const EventDetail = ({ welcome }) => {
  const router = useRouter();
  const id = router.query.id;

  return (
    <>
      <h1>Event {id}</h1>
      {welcome}
    </>
  );
};

export default EventDetail;
