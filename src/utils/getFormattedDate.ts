import { format } from "date-fns";

const getFormattedDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy");
};

export default getFormattedDate;
