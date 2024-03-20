import { useState } from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const DatePicker = () => {
  const [value, onChange] = useState<Value>([new Date(), new Date()]);
  return (
    <div>
      <DateRangePicker
        onChange={onChange}
        value={value}
        className={"text-md"}
        isOpen={true}
        format="dd-MM-yyyy"
      />
    </div>
  );
};

export default DatePicker;
