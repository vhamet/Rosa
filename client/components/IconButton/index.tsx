import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./IconButton.module.scss";

type IconButtonProps = {
  icon: IconDefinition;
  onClick: () => void;
  tooltip?: string;
};

const IconButton = ({ icon, onClick, tooltip }: IconButtonProps) => (
  <div
    className={styles["icon-button"]}
    onClick={() => onClick?.()}
    title={tooltip}
  >
    <FontAwesomeIcon icon={icon} />
  </div>
);

export default IconButton;
