import Head from "next/head";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Home</h1>

        <div>
          <Link href="/events">Events</Link>
          <Link href="/signin">Sign in</Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
