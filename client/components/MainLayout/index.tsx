import Header from "../Header";

import styles from "./MainLayout.module.scss";

const MainLayout = ({ children }) => (
  <div className={styles["main-layout"]}>
    <Header />
    <div className={styles["main-layout__content"]}>{children}</div>
  </div>
);

export default MainLayout;
