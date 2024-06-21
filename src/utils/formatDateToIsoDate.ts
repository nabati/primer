import { format } from "date-fns";

const formatDateToIsoDate = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export default formatDateToIsoDate;
