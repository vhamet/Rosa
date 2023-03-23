import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

import Card from "../../components/Card";
import UserAvatar, { AvatarSize } from "../../components/UserAvatar";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";
import {
  addApolloState,
  initializeApollo,
} from "../../services/apollo/apollo-client";

import styles from "./users.module.scss";

const USERS_QUERY = gql`
  query {
    users {
      id
      username
      createdAt
      phone
      pictureUrl
    }
  }
`;

export const getServerSideProps = async (context) => {
  let props = {};
  if (context) {
    const apolloClient = initializeApollo({ context });
    try {
      const { data } = await apolloClient.query({
        query: USERS_QUERY,
      });
      props = { pastEvents: data.users };
    } catch (error) {
      const gqlError = error.graphQLErrors[0];
      if (gqlError) {
        console.error({ error });
      }
    }

    return addApolloState(apolloClient, { props });
  }
};

const Users = () => {
  const { loading, error, data } = useQuery(USERS_QUERY);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error !</p>;
  }

  return (
    <div className={styles.users}>
      <Head>
        <title>Users | Rosa</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Card classnames={styles.users__list}>
        <h1>Rosa users</h1>
        <table>
          <tbody>
            {data?.users.map((user) => (
              <tr key={user.id}>
                <td className={styles.users__user}>
                  <UserAvatar user={user} size={AvatarSize.large} />
                  <div className={styles.users__name}>
                    <Link href={`/users/${user.id}`}>{user.username}</Link>
                    <label>
                      <FontAwesomeIcon icon={faPhone} /> {user.phone || "N/A"}
                    </label>
                  </div>
                </td>
                <td>Resident</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default withPrivateRouteHOC(Users);
