/* eslint-disable no-prototype-builtins */
import moment from "moment";

export const token = {
  get: localStorage.getItem("token"),
  set: (value: string) => localStorage.setItem("token", value),
  delete: () => localStorage.removeItem("token"),
};

export const capitalize = (value?: string) =>
  !value
    ? ""
    : value.charAt(0).toUpperCase() +
      value.substring(1, value.length).toLowerCase();

export const calculateRemainingProbation = (start: string, end: string) => {
  const startDate = moment(start);
  const endDate = moment(end);

  const diffDays = endDate.diff(startDate, "days");

  const remainingDuration = moment.duration(diffDays, "days");
  const months = remainingDuration.months();
  const days = remainingDuration.days();

  return `${months} Bulan ${days} Hari`;
};

export const formattedDate = (isoDate: string) =>
  moment(isoDate).format("DD MMM YYYY");
export const formattedTime = (isoDate: string) =>
  moment(isoDate).format("HH:mm");

export const getAcademicYears = () => {
  const currYear = moment().year();
  const currMonth = moment().month();
  const years = [];

  for (let year = 2023; year <= currYear; year++) {
    if (year == currYear && currMonth < 6) break;
    years.push(`${year}/${year + 1}`);
  }

  return years;
};

export const getCurrentAcademicYear = () => {
  const years = getAcademicYears();
  const currYear = moment().year();
  const currMonth = moment().month();

  const found = years.filter((year) => {
    if (currMonth >= 6) return year.startsWith(currYear.toString());
    else return year.startsWith((currYear - 1).toString());
  });

  return found.length ? found[0] : years[1];
};

export const moneyFormat = (
  number: number,
  locale = "id-ID",
  currency = "IDR"
) => {
  let formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(number);

  if (formatted.includes(",")) {
    formatted = formatted.replace(/,00$/, "");
  }

  return formatted;
};

export const getReversedNumbersByLen = (length: number) => {
  if (typeof length !== "number" || length <= 0 || !Number.isInteger(length)) {
    return [];
  }

  const result = [];
  for (let i = length; i >= 1; i--) {
    result.push(i);
  }

  return result;
};

export const getMonday = (date: Date) => {
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  return date;
};

export const getSemesters = () => {
  return [
    {
      value: 1,
      label: "Ganjil",
    },
    {
      value: 2,
      label: "Genap",
    },
  ];
};

export const filterParams = (params?: Record<string, unknown>) => {
  if (!params) return {};
  return Object.entries(params)
    .filter(([, value]) =>
      Array.isArray(value)
        ? value.length > 0
        : !(value === undefined || value === "" || value === null)
    )
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

export const filterEmptyPayload = (payload: any): any => {
  const newPayload: any = {};

  for (let key in payload) {
    if (
      (typeof payload[key] == "string" && payload[key] == "") ||
      (typeof payload[key] == "number" && payload[key] == 0) ||
      payload[key] == null ||
      payload[key] == undefined
    )
      continue;
    newPayload[key] = payload[key];
  }

  return newPayload;
};
