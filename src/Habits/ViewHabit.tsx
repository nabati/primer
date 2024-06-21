import { subDays } from "date-fns";
import range from "lodash/range";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import EntryForm from "./EntryForm";

import Heatmap from "./Heatmap/Heatmap.tsx";
import useEvents from "./hooks/useEvents.ts";
import SummaryTable from "./SummaryTable/SummaryTable.tsx";

type ViewHabitProps = {};

const ViewHabit: React.FC<ViewHabitProps> = () => {
  const { id } = useParams<{ id: string }>();

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

      <div>Habit tracker calendar 1.</div>

      <div>
        <EntryForm habitId={id} />
      </div>

      <Heatmap
        startDate={subDays(new Date(), 30)}
        endDate={new Date()}
        events={events}
      />

      <SummaryTable habitId={id} />

      <div>Notes?</div>
    </div>
  );
};

export default ViewHabit;
