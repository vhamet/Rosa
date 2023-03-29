import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import jwtDecode from "jwt-decode";
import { gql, useMutation, useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";

import {
  initializeApollo,
  addApolloState,
} from "../../services/apollo/apollo-client";
import Card from "../../components/Card";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";
import Button from "../../components/Button";
import Profile from "./Profile";
import UpdateProfile from "./UpdateProfile";
import { ACCESS_TOKEN } from "../../utils/const";
import useUserContext, {
  UserReducerActions,
} from "../../services/authentication/user-context";
import { User } from "../../utils/types";

import styles from "./[id].module.scss";

export type ProfileData = {
  username: string;
  phone?: string;
  color?: string;
  picture?: File;
};

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

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($userId: Float!, $userData: UserUpdateInput!) {
    updateProfile(userId: $userId, userData: $userData) {
      id
      username
      phone
      color
      pictureUrl
    }
  }
`;

const updateProfilePicture = async (picture: File): Promise<User> => {
  const body = new FormData();
  body.append("file", picture);
  const token = Cookies.get(ACCESS_TOKEN);
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_URL_SERVER}/user/uploadProfilePicture`,
    {
      method: "POST",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      body,
    }
  );

  return await result.json();
};

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

const User = ({ auth }) => {
  const router = useRouter();
  const id = +router.query.id;
  const { dispatch } = useUserContext();
  const [updating, setUpdating] = useState(false);
  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: { id },
  });

  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
    onCompleted: (data) => {
      dispatch({
        type: UserReducerActions.update,
        payload: data.updateProfile,
      });
      setUpdating(false);
    },
    onError: (error) => console.error({ error }),
  });
  const onModify = async (formData: ProfileData) => {
    const { picture, ...userData } = formData;
    if (picture) {
      await updateProfilePicture(picture);
    }
    updateProfile({ variables: { userId: id, userData } });
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error !</p>;
  }

  return (
    <div className={styles["profile"]}>
      <Head>
        <title>{`${data?.user.username} | Rosa`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div
        onClick={() => router.push("/users")}
        className={`${styles["profile__back"]} link`}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Members
      </div>

      <Card classnames={styles["profile__card"]}>
        {updating ? (
          <UpdateProfile
            user={data?.user}
            onConfirm={onModify}
            onCancel={() => setUpdating(false)}
          />
        ) : (
          <Profile user={data?.user} />
        )}
      </Card>
      {id === auth.id && (
        <div className={styles["profile__actions"]}>
          {!updating && (
            <Button onClick={() => setUpdating(true)} label="Modify" />
          )}
        </div>
      )}
    </div>
  );
};

export default withPrivateRouteHOC(User);