import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";

import styles from "./Tabs.module.scss";

type Tab = {
  id: string;
  title: string;
  content?: ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultSelection?: string;
};

const Tabs = ({ tabs, defaultSelection }: TabsProps) => {
  const [selected, setSelected] = useState(defaultSelection || tabs[0].id);

  const router = useRouter();
  useEffect(() => {
    const { tab } = router.query;
    if (tab) {
      if (tab !== tabs[0].id && tab !== defaultSelection) {
        setSelected(tab.toString());
      }
    } else {
      router.push({ pathname: "/events", query: { tab: tabs[0].id } });
    }
  }, []);

  const onTabSelection = (id: string) => {
    setSelected(id);
    router.push({ pathname: "/events", query: { tab: id } });
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.tabs__header}>
        {tabs.map(({ id, title }) => (
          <div
            key={id}
            className={`${styles.tabs__tab} ${
              selected === id ? styles.selected : ""
            }`}
            onClick={() => onTabSelection(id)}
          >
            {title}
          </div>
        ))}
      </div>

      <div className={styles.tabs__content}>
        {tabs.find(({ id }) => id === selected).content}
      </div>
    </div>
  );
};

export default Tabs;
