import { gql, useMutation } from "@apollo/client";
import AuthenticationForm from "../../components/AuthenticationForm";

const SIGNIN_MUTATION = gql`
  mutation Signin($username: String!, $password: String!) {
    signin(username: $username, password: $password)
  }
`;

const Signin = () => {
  const [signin] = useMutation(SIGNIN_MUTATION, {
    onError: (error) => console.log({ error }),
    onCompleted: (data) => console.log({ data }),
  });
  const onSubmit = (formData) => {
    console.log({ formData });
    signin({ variables: formData });
  };

  return (
    <>
      <h1>Sign in</h1>
      <AuthenticationForm onSubmit={onSubmit} actionLabel="Sign in" />
    </>
  );
};

export default Signin;
