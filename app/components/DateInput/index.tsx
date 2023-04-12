import { Control, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { FieldValues } from "react-hook-form";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./DateInput.module.scss";

type DateInputProps = {
  name: string;
  control: Control<FieldValues, any>;
  defaultValue?: Date;
  minDate?: Date;
  withTime?: boolean;
};

const DateInput = ({
  name,
  control,
  defaultValue,
  minDate,
  withTime,
}: DateInputProps) => (
  <div className={styles["date-input"]}>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value } }) => (
        <DatePicker
          minDate={minDate}
          dateFormat={withTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
          timeFormat="HH:mm"
          selected={value}
          onChange={onChange}
          showTimeSelect={withTime}
        />
      )}
    />
  </div>
);

export default DateInput;
