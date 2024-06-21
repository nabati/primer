import { subDays } from "date-fns";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import useHabit from "../hooks/useHabit.ts";

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

  const { data: habit, isFetching: isFetchingHabit } = useHabit({ id });

  const { startDate, endDate } = useMemo(() => {
    const date = new Date();
    return {
      startDate: subDays(date, 30),
      endDate: date,
    };
  }, []);

  const { data: events } = useEvents({ habitId: id, startDate, endDate });

  if (isFetchingHabit) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{habit.title}</h1>

      <Heatmap
        startDate={startDate}
        endDate={endDate}
        events={events}
        habitId={id}
      />

      <SummaryTable habitId={id} />

      <div>Notes?</div>
    </div>
  );
};

export default ViewHabit;
