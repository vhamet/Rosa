import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";

import useClickOutside from "../hooks/useClickOutside";
import { DropdownOption } from "../../utils/types";

import styles from "./Dropdown.module.scss";

type DropdownProps = {
  options: DropdownOption[];
  onChange: (key: string) => void;
  defaultSelection?: string;
  placeholder?: string;
  rightAlign?: boolean;
};

const Dropdown = ({
  options,
  onChange,
  defaultSelection,
  placeholder,
  rightAlign,
}: DropdownProps) => {
  const dropdownRef = useRef();
  const [open, setOpen] = useState(false);
  useClickOutside(dropdownRef, () => setOpen(false));

  const [selectedOption, setSelectedOption] = useState(
    options.find(({ key }) => key === defaultSelection)
  );
  const handleSelection = (option: DropdownOption) => {
    onChange(option.key);
    setSelectedOption(option);
    setOpen(false);
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div
        className={`${styles.dropdown__input} ${
          open ? styles.dropdown__open : ""
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        {selectedOption ? (
          <label>{selectedOption.label}</label>
        ) : (
          <label className="dropdown__placeholder">
            {placeholder || "Select option"}
          </label>
        )}
        <FontAwesomeIcon icon={faChevronUp} />
      </div>
      <div
        className={`${styles.dropdown__menu} ${
          open ? styles.dropdown__open : ""
        }`}
        style={{ [rightAlign ? "right" : "left"]: 0 }}
      >
        {options.map((option) => (
          <div
            key={option.key}
            className={`${styles.dropdown__option} ${
              option.key === selectedOption?.key
                ? styles.dropdown__selected
                : ""
            }`}
            onClick={() => handleSelection(option)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
