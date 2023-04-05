import { gql, useMutation, useQuery } from "@apollo/client";
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
import { capitalize } from "../../utils/utils";
import Tag, { getRoleStyle } from "../../components/Tag";
import { User } from "../../utils/types";
import { ACCESS_TOKEN, ROLE_OPTIONS, Role } from "../../utils/const";
import Dropdown from "../../components/Dropdown";
import jwtDecode from "jwt-decode";

import styles from "./users.module.scss";

const USERS_QUERY = gql`
  query {
    users {
      id
      username
      createdAt
      phone
      pictureUrl
      color
      role
    }
  }
`;

const ROLE_MUTATION = gql`
  mutation UpdateRole($userId: Float!, $role: String!) {
    updateRole(userId: $userId, role: $role) {
      id
      role
    }
  }
`;

export const getServerSideProps = async (context) => {
  const token = context.req?.cookies?.[ACCESS_TOKEN];
  const auth = token && jwtDecode(token);

  let props = {};
  if (context) {
    const apolloClient = initializeApollo({ context });
    try {
      const { data } = await apolloClient.query({
        query: USERS_QUERY,
      });
      props = { pastEvents: data.users, auth };
    } catch (error) {
      const gqlError = error.graphQLErrors[0];
      if (gqlError) {
        console.error({ error });
      }
    }

    return addApolloState(apolloClient, { props });
  }
};

const Users = ({ auth }) => {
  const { loading, error, data } = useQuery(USERS_QUERY);

  const [updateRole] = useMutation(ROLE_MUTATION);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error !</p>;
  }

  return (
    <div className={styles.users}>
      <Head>
        <title>Members | Rosa</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Card className={styles.users__list}>
        <h1>Members</h1>
        <table>
          <tbody>
            {data?.users.map((user: User) => (
              <tr key={user.id}>
                <td className={styles.users__user}>
                  <UserAvatar user={user} size={AvatarSize.large} />
                  <div className={styles.users__name}>
                    <Link
                      href={`/users/${user.id}`}
                      style={{ color: user.color }}
                      className={user.color ? "custom" : "standard"}
                    >
                      {user.username}
                    </Link>
                    <label>
                      <FontAwesomeIcon icon={faPhone} /> {user.phone || "N/A"}
                    </label>
                  </div>
                </td>
                <td>
                  {auth?.role === Role.ADMIN ? (
                    <Dropdown
                      options={ROLE_OPTIONS}
                      onChange={(selection) =>
                        updateRole({
                          variables: { userId: user.id, role: selection },
                        })
                      }
                      defaultSelection={user.role}
                      rightAlign
                    />
                  ) : (
                    <Tag style={getRoleStyle(user.role)} shallow>
                      {capitalize(user.role)}
                    </Tag>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default withPrivateRouteHOC(Users);
