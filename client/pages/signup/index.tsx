import { gql, useMutation } from "@apollo/client";
import AuthenticationForm from "../../components/AuthenticationForm";

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password)
  }
`;

const Signup = () => {
  const [signup] = useMutation(SIGNUP_MUTATION, {
    onError: (error) => console.log({ error }),
    onCompleted: (data) => console.log({ data }),
  });
  const onSubmit = (formData) => {
    console.log({ formData });
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
