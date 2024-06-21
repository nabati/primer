import { subDays } from "date-fns";
import range from "lodash/range";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import Heatmap from "./Heatmap/Heatmap.tsx";
import useEvents from "../hooks/useEvents.ts";
import SummaryTable from "./SummaryTable/SummaryTable.tsx";

type ViewHabitProps = {
  habitId: string;
};

const ViewHabit: React.FC<ViewHabitProps> = () => {
  const { id } = useParams<{ id: string }>();

  if (id === undefined) {
    throw new Error("id is required.");
  }

  const { dates, startDate, endDate } = useMemo(() => {
    const today = new Date();
    const dates = range(0, 30).map((i) => subDays(today, i));
    return {
      dates,
      startDate: dates[dates.length - 1],
      endDate: dates[0],
    };
  }, []);

  const { data: events } = useEvents({ habitId: id, startDate, endDate });

  return (
    <div>
      <div>Habit</div>

      <Heatmap
        startDate={subDays(new Date(), 30)}
        endDate={new Date()}
        events={events}
        habitId={id}
      />

      <SummaryTable habitId={id} />

      <div>Notes?</div>
    </div>
  );
};

export default ViewHabit;
