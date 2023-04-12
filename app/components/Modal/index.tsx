import { ReactNode, useEffect, useRef } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import Card from "../Card";
import IconButton, { IconButtonSize } from "../IconButton";
import useClickOutside from "../hooks/useClickOutside";

import styles from "./Modal.module.scss";

type ModalProps = {
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
};

const Modal = ({ visible, onClose, children }: ModalProps) => {
  const modalRef = useRef();
  useClickOutside(modalRef, onClose);

  useEffect(() => {
    document.body.setAttribute(
      "style",
      `overflow: ${visible ? "hidden" : "auto"};`
    );
    return () => {
      document.body.setAttribute("style", "overflow: auto");
    };
  }, [visible]);

  return (
    <div className={styles.modal}>
      {visible && (
        <div
          className={`${styles.modal__overlay} ${
            visible ? styles.visible : ""
          }`}
        >
          <Card ref={modalRef} className={styles.modal__content}>
            <IconButton
              className={styles["icon-button"]}
              icon={faXmark}
              onClick={onClose}
              size={IconButtonSize.small}
            />
            {children}
          </Card>
        </div>
      )}
    </div>
  );
};

export default Modal;
