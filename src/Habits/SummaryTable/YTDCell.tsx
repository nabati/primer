import { startOfYear } from "date-fns";
import React from "react";
import formatDateToIsoDate from "../../utils/formatDateToIsoDate.ts";
import useEvents from "../../hooks/useEvents.ts";
import { sumBy } from "lodash";

type YtdCellProps = {
  habitId: string;
};

const YtdCell: React.FC<YtdCellProps> = ({ habitId }) => {
  const { data: events } = useEvents({
    habitId,
    startDate: formatDateToIsoDate(startOfYear(new Date())),
    endDate: formatDateToIsoDate(new Date()),
  });

  return <div>{sumBy(events, (event) => event.value ?? 0)}</div>;
};

export default YtdCell;
