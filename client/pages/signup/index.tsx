import { gql, useMutation } from "@apollo/client";
import AuthenticationForm from "../../components/AuthenticationForm";
import useUserContext from "../../services/authentication/user-context";
import { authenticateUser } from "../../services/authentication/utils";

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
    <>
      <h1>Sign up</h1>
      <AuthenticationForm onSubmit={onSubmit} actionLabel="Sign up" />
    </>
  );
};

export default Signup;
