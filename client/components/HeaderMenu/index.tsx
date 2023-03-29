import { ReactNode, useRef, useState } from "react";

import useClickOutside from "../useClickOutside";

import styles from "./HeaderMenu.module.scss";

type HeaderMenu = {
  header: ReactNode;
  children: ReactNode;
};

const HeaderMenu = ({ header, children }) => {
  const [opened, setOpened] = useState(false);

  const containerRef = useRef();
  useClickOutside(containerRef, () => setOpened(false));

  return (
    <div className={styles["header-menu"]} ref={containerRef}>
      <div
        className={styles["header-menu__header"]}
        onClick={() => setOpened((o) => !o)}
      >
        {header}
      </div>
      {opened && (
        <div className={styles["header-menu__content"]}>{children}</div>
      )}
    </div>
  );
};

export default HeaderMenu;
