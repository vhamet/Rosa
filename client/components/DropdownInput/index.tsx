import { Control, Controller } from "react-hook-form";
import { FieldValues } from "react-hook-form";

import Dropdown from "../Dropdown";
import { DropdownOption } from "../../utils/types";

type DropdownInputProps = {
  name: string;
  control: Control<FieldValues, any>;
  defaultValue?: string;
  options: DropdownOption[];
  placeholder?: string;
  rightAlign?: boolean;
};

const DropdownInput = ({
  name,
  control,
  defaultValue,
  options,
  placeholder,
  rightAlign,
}: DropdownInputProps) => (
  <Controller
    name={name}
    control={control}
    defaultValue={defaultValue}
    render={({ field: { onChange, value } }) => (
      <Dropdown
        options={options}
        onChange={onChange}
        defaultSelection={value}
        placeholder={placeholder}
        rightAlign={rightAlign}
      />
    )}
  />
);

export default DropdownInput;
