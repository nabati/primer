import { differenceInDays, isSameDay, startOfDecade } from "date-fns";
import { sortBy } from "lodash";
import React, { useMemo } from "react";
import formatDateToIsoDate from "../../utils/formatDateToIsoDate.ts";
import useEvents from "../../hooks/useEvents.ts";
import { CircularProgress } from "@mui/material";

type StreakCellProps = {
  habitId: string;
};

const computeCurrentStreak = (
  events: { date: Date; value: number }[],
  referenceDate: Date,
) => {
  const sortedEvents = sortBy(events, (event) => event.date);
  let streak = 0;
  for (let i = sortedEvents.length - 1; i >= 0; i--) {
    if (differenceInDays(referenceDate, sortedEvents[i].date) > i) {
      console.log("idff in days is wrong");
      break;
    }

    if (sortedEvents[i].value === 0) {
      console.log(sortedEvents[i]);
      console.log(";value is 0");
      break;
    }

    streak++;
  }
  return streak;
};

const StreakCell: React.FC<StreakCellProps> = ({ habitId }) => {
  const { data: events, isFetching } = useEvents({
    habitId,
    startDate: formatDateToIsoDate(startOfDecade(new Date())),
    endDate: formatDateToIsoDate(new Date()),
  });

  const today = useMemo(() => new Date(), []);

  if (isFetching) {
    return <CircularProgress />;
  }

  return <div>{computeCurrentStreak(events, today)}</div>;
};

export default StreakCell;
