import moment from "moment";
import "moment/dist/locale/id";

export const formatTime = (time: any, format: string, locale: string = "id") =>
  moment(time).locale(locale).format(format);
