import { ReactNode, useRef, useState } from "react";

import useClickOutside from "../hooks/useClickOutside";

import styles from "./HeaderMenu.module.scss";

type HeaderMenu = {
  header: ReactNode;
  children: ReactNode;
};

const HeaderMenu = ({ header, children }) => {
  const [open, setOpen] = useState(false);

  const containerRef = useRef();
  useClickOutside(containerRef, () => setOpen(false));

  return (
    <div className={styles["header-menu"]} ref={containerRef}>
      <div
        className={styles["header-menu__header"]}
        onClick={() => setOpen((o) => !o)}
      >
        {header}
      </div>
      {open && <div className={styles["header-menu__content"]}>{children}</div>}
    </div>
  );
};

export default HeaderMenu;
