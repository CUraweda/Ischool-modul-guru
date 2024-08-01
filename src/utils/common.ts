import moment from "moment";

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

  let result = [];
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
