import Link from "next/link";
import withPrivateRouteHOC from "../../components/withPrivateRouteHOC";
import useUserContext from "../../services/authentication/user-context";
import { signout } from "../../services/authentication/utils";

const Events = () => {
  const { dispatch } = useUserContext();

  return (
    <>
      <h1>Events list</h1>
      <ul>
        <li>
          <Link href="/events/1">Matt goodbye</Link>
        </li>
        <li>
          <Link href="/events/2">Barathon</Link>
        </li>
        <li>
          <Link href="/events/3">Party</Link>
        </li>
      </ul>
      <input type="button" onClick={() => signout(dispatch)} value="Sign out" />
    </>
  );
};

export default withPrivateRouteHOC(Events);
