import { gql, useMutation } from "@apollo/client";
import Head from "next/head";
import Link from "next/link";
import AuthenticationForm from "../../components/AuthenticationForm";
import Card from "../../components/Card";
import useUserContext from "../../services/authentication/user-context";
import { authenticateUser } from "../../services/authentication/utils";

import styles from "./signup.module.scss";

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password)
  }
`;

const Signup = () => {
  const { dispatch } = useUserContext();

  const [signup] = useMutation(SIGNUP_MUTATION, {
    onError: (error) => console.error({ error }),
    onCompleted: (data) => authenticateUser(data.signup, dispatch),
  });
  const onSubmit = (formData) => {
    signup({ variables: formData });
  };

  return (
    <Card classnames={styles.signup}>
      <Head>
        <title>Signin | Rosa</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.signup__content}>
        <h1>Sign up</h1>
        <AuthenticationForm onSubmit={onSubmit} actionLabel="Sign up" />
        <div className={styles.signup__signin}>
          <div className={styles.signup__separator}></div>
          <label>
            Already a member ? <Link href="/signin">Signin here</Link>.
          </label>
        </div>
      </div>
    </Card>
  );
};

export default Signup;
