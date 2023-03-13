import { gql, useMutation } from "@apollo/client";
import Link from "next/link";
import AuthenticationForm from "../../components/AuthenticationForm";
import withSignedHOC from "../../components/withSignedHOC";
import useUserContext from "../../services/authentication/user-context";
import { authenticateUser } from "../../services/authentication/utils";

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
    <>
      <h1>Sign in</h1>
      <AuthenticationForm onSubmit={onSubmit} actionLabel="Sign in" />
      <Link href="/events">Events</Link>
    </>
  );
};

export default withSignedHOC(Signin);
