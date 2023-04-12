import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./IconButton.module.scss";

export enum IconButtonKind {
  primary = "primary",
  secondary = "secondary",
  danger = "danger",
}

export enum IconButtonSize {
  small = "1rem",
  medium = "1.5rem",
  large = "2rem",
}

type IconButtonProps = {
  icon: IconDefinition;
  onClick: () => void;
  tooltip?: string;
  kind?: IconButtonKind;
  size?: IconButtonSize;
  withBackground?: boolean;
  className?: string;
};

const IconButton = ({
  icon,
  onClick,
  tooltip,
  kind = IconButtonKind.primary,
  size = IconButtonSize.medium,
  withBackground,
  className,
}: IconButtonProps) => {
  return (
    <div
      className={`${styles["icon-button"]} ${styles[kind]} ${className || ""} ${
        withBackground ? styles.background : ""
      } `}
      onClick={() => onClick?.()}
      title={tooltip}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: size }} />
    </div>
  );
};

export default IconButton;
