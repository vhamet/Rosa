import { useRef, useState } from "react";
import {
  UseFormRegister,
  FieldValues,
  RegisterOptions,
  UseFormSetValue,
} from "react-hook-form";
import { ChromePicker } from "react-color";

import useClickOutside from "../hooks/useClickOutside";

import styles from "./ColorInput.module.scss";

type ColorInputProps = {
  name: string;
  register: UseFormRegister<FieldValues>;
  options?: RegisterOptions;
  setValue: UseFormSetValue<FieldValues>;
  defaultValue?: any;
};

const ColorInput = ({
  name,
  defaultValue,
  register,
  setValue,
  options,
}: ColorInputProps) => {
  const [currentColor, setCurrentColor] = useState(defaultValue || "");
  const [opened, setOpened] = useState(false);
  const handleChange = (color) => {
    setCurrentColor(color?.hex);
    setValue(name, color?.hex || "");
  };

  const inputRef = useRef();
  const hidePicker = () => setOpened(false);
  useClickOutside(inputRef, hidePicker);

  return (
    <div className={styles["color-input"]} ref={inputRef}>
      <div
        className={styles["color-input__color"]}
        onClick={() => setOpened((opened) => !opened)}
      >
        <div
          className={styles["color-input__color-content"]}
          style={{ backgroundColor: currentColor || defaultValue }}
        ></div>
        <input
          type="hidden"
          value={currentColor || ""}
          {...register(name, options)}
        />
      </div>
      {opened && (
        <div className={styles["color-input__picker"]}>
          <ChromePicker
            color={currentColor}
            onChange={handleChange}
            disableAlpha
          />
        </div>
      )}
    </div>
  );
};

export default ColorInput;
