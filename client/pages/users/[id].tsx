import { useRouter } from "next/router";
import Head from "next/head";
import jwtDecode from "jwt-decode";
import { gql, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPhone } from "@fortawesome/free-solid-svg-icons";

import {
  initializeApollo,
  addApolloState,
} from "../../services/apollo/apollo-client";
import Card from "../../components/Card";
import { ACCESS_TOKEN } from "../../utils/const";

import styles from "./[id].module.scss";
import UserAvatar, { AvatarSize } from "../../components/UserAvatar";
import { daysDiff } from "../../utils/dates";

const USER_QUERY = gql`
  query User($id: Float!) {
    user(id: $id) {
      id
      username
      phone
      createdAt
      pictureUrl
      color
    }
  }
`;

export const getServerSideProps = async (context) => {
  let user, auth;
  if (context) {
    const apolloClient = initializeApollo({ context });
    try {
      const { data } = await apolloClient.query({
        query: USER_QUERY,
        variables: { id: +context.params.id },
      });
      user = data?.user;
    } catch (error) {
      const gqlError = error.graphQLErrors?.[0];
      if (gqlError) {
        console.error({ error });
      }
    }

    const token = context.req?.cookies?.[ACCESS_TOKEN];
    auth = token && jwtDecode(token);

    return addApolloState(apolloClient, { props: { user, auth } });
  }
};

const Profile = ({ auth }) => {
  const router = useRouter();
  const id = +router.query.id;
  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: { id },
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error !</p>;
  }

  const {
    user: { username, phone, createdAt, color },
  } = data;

  return (
    <div className={styles["profile"]}>
      <Head>
        <title>{`${username} | Rosa`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div
        onClick={() => router.push("/users")}
        className={`${styles["profile__back"]} link`}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Users
      </div>

      <Card classnames={styles["profile__card"]}>
        <UserAvatar user={data?.user} size={AvatarSize.xlarge} />
        <div className={styles["profile__info"]}>
          <label className={styles["profile__name"]} style={color && { color }}>
            {username}
          </label>
          <label className={styles["profile__phone"]}>
            <FontAwesomeIcon icon={faPhone} style={color && { color }} />{" "}
            {phone || "N/A"}
          </label>
          <label className={styles["profile__since"]}>
            Member for {daysDiff(createdAt, Date.now())} days
          </label>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
