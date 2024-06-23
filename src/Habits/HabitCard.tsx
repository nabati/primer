import { Card } from "@mui/material";
import { subDays } from "date-fns";
import React, { useMemo } from "react";
import useHabit from "../hooks/useHabit.ts";

import Heatmap from "./Heatmap/Heatmap.tsx";
import useEvents from "../hooks/useEvents.ts";
import SummaryTable from "./SummaryTable/SummaryTable.tsx";
import styled from "styled-components";

type HabitCardProps = {
  id: string;
};

const DAYS_TO_SHOW = 12;

const HabitCard: React.FC<HabitCardProps> = ({ id }) => {
  if (id === undefined) {
    throw new Error("id is required.");
  }

  const { data: habit, isFetching: isFetchingHabit } = useHabit({ id });

  const { startDate, endDate } = useMemo(() => {
    const date = new Date();
    return {
      startDate: subDays(date, DAYS_TO_SHOW - 1),
      endDate: date,
    };
  }, []);

  const { data: events } = useEvents({ habitId: id, startDate, endDate });

  if (isFetchingHabit) {
    return null;
  }

  return (
    <Card sx={{ padding: "16px" }}>
      <Title>{habit.title}</Title>

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

const Title = styled.div`
  font-size: 1.2em;
  font-weight: bold;
`;

export default HabitCard;
