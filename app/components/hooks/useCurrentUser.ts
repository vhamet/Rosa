import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { USER_QUERY } from "../../pages/users/[id]";
import useUserContext from "../../services/authentication/user-context";

const useCurrentUser = () => {
  const { auth } = useUserContext();

  const { data, refetch } = useQuery(USER_QUERY, {
    variables: { id: auth?.id },
    skip: !auth,
  });

  useEffect(() => {
    refetch();
  }, [auth]);

  return data?.user;
};

export default useCurrentUser;
