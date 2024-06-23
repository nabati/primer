import { Card } from "@mui/material";
import { subDays } from "date-fns";
import React, { useMemo } from "react";
import useHabit from "../hooks/useHabit.ts";

import Heatmap from "./Heatmap/Heatmap.tsx";
import useEvents from "../hooks/useEvents.ts";
import SummaryTable from "./SummaryTable/SummaryTable.tsx";

type HabitCardProps = {
  id: string;
};

const HabitCard: React.FC<HabitCardProps> = ({ id }) => {
  if (id === undefined) {
    throw new Error("id is required.");
  }

  const { data: habit, isFetching: isFetchingHabit } = useHabit({ id });

  const { startDate, endDate } = useMemo(() => {
    const date = new Date();
    return {
      startDate: subDays(date, 14),
      endDate: date,
    };
  }, []);

  const { data: events } = useEvents({ habitId: id, startDate, endDate });

  if (isFetchingHabit) {
    return null;
  }

  return (
    <Card sx={{ padding: "16px" }}>
      <h1>{habit.title}</h1>

      <Heatmap
        startDate={startDate}
        endDate={endDate}
        events={events}
        habitId={id}
      />

      <SummaryTable habitId={id} />
    </Card>
  );
};

export default HabitCard;
