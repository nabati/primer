import { differenceInDays, startOfDecade } from "date-fns";
import { sortBy } from "lodash";
import React, { useMemo } from "react";
import formatDateToIsoDate from "../../utils/formatDateToIsoDate.ts";
import useListEvents from "../../hooks/useListEvents.ts";

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
      break;
    }

    if (sortedEvents[i].value === 0) {
      break;
    }

    streak++;
  }
  return streak;
};

const StreakCell: React.FC<StreakCellProps> = ({ habitId }) => {
  const { data: events, isFetching } = useListEvents({
    habitId,
    startDate: formatDateToIsoDate(startOfDecade(new Date())),
    endDate: formatDateToIsoDate(new Date()),
  });

  const today = useMemo(() => new Date(), []);

  if (isFetching) {
    return <div>-</div>;
  }

  return <div>{computeCurrentStreak(events, today)}</div>;
};

export default StreakCell;
