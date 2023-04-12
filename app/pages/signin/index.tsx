import { gql, useMutation } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import AuthenticationForm from "../../components/AuthenticationForm";
import Card from "../../components/Card";
import withSignedHOC from "../../components/withSignedHOC";
import useUserContext from "../../services/authentication/user-context";
import { authenticateUser } from "../../services/authentication/utils";

import styles from "./signin.module.scss";

const SIGNIN_MUTATION = gql`
  mutation Signin($username: String!, $password: String!) {
    signin(username: $username, password: $password)
  }
`;

const Signin = () => {
  const { dispatch } = useUserContext();

  const [signin] = useMutation(SIGNIN_MUTATION, {
    onError: (error) => console.error({ error }),
    onCompleted: (data) => authenticateUser(data.signin, dispatch),
  });
  const onSubmit = (formData) => {
    signin({ variables: formData });
  };

  return (
    <Card className={styles.signin}>
      <Head>
        <title>Signin | Rosa</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.signin__content}>
        <h1>Sign in</h1>
        <AuthenticationForm onSubmit={onSubmit} actionLabel="Sign in" />
        <div className={styles.signin__signup}>
          <div className={styles.signin__separator}></div>
          <label>
            Not a member yet ? <Link href="/signup">Signup here</Link>.
          </label>
        </div>
      </div>
    </Card>
  );
};

export default withSignedHOC(Signin);
