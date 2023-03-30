import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

import styles from "./ImageInput.module.scss";

export enum ImageInputStyle {
  square,
  round,
}

export enum ImageInputSize {
  xsmall = "1rem",
  small = "1.5rem",
  medium = "3rem",
  large = "4rem",
  xlarge = "6rem",
}

type ImageInputProps = {
  name: string;
  setValue: UseFormSetValue<FieldValues>;
  pictureUrl?: string;
  style?: ImageInputStyle;
  size?: ImageInputSize;
};

const ImageInput = ({
  name,
  setValue,
  pictureUrl,
  style = ImageInputStyle.square,
  size = ImageInputSize.medium,
}: ImageInputProps) => {
  const inputRef = useRef<HTMLInputElement>();
  const [picture, setPicture] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const handlePictureSelection = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setPicture(undefined);
      setValue(name, "");
      return;
    }

    setPicture(event.target.files[0]);
    setValue(name, event.target.files[0]);
  };

  useEffect(() => {
    if (!picture) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(picture);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [picture]);

  const sizes = {
    height: size,
    width: size,
    minHeight: size,
    minWidth: size,
    maxHeight: size,
    maxWidth: size,
    fontSize: `calc(${size} / 3)`,
    borderRadius: style === ImageInputStyle.square ? "8px" : "50px",
  };

  return (
    <div className={styles["image-input"]}>
      <div
        className={styles["image-input__preview"]}
        style={sizes}
        onClick={() => inputRef.current?.click()}
      >
        {preview || pictureUrl ? (
          <img src={preview || pictureUrl} alt="preview" style={sizes} />
        ) : (
          <FontAwesomeIcon icon={faCamera} />
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        className={styles["image-input__input"]}
        onChange={handlePictureSelection}
        accept="image/png, image/gif, image/jpeg"
      />
    </div>
  );
};

export default ImageInput;
