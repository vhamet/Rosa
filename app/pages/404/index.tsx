import Link from "next/link";
import styles from "./404.module.scss";

const Custom404 = () => {
  return (
    <div className={styles._404}>
      <h1>Nothing to see here</h1>
      <img src={"sou.jpeg"} alt="404" />
      <Link href="/">{`> Home <`}</Link>
    </div>
  );
};

export default Custom404;
