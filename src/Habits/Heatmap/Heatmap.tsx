import { addDays, differenceInDays, isSameDay, startOfDay } from "date-fns";
import range from "lodash/range";
import React, { useMemo } from "react";
import styled from "styled-components";
import Cell from "./Cell";

type HeatmapCalendarProps = {
  habitId: string;
  startDate: Date; // Only date portion is used
  endDate: Date; // Only date portion is used
  events: { date: Date; value: number }[];
};

type PreparedDatum = {
  date: Date;
  value?: number;
  streak?: number;
};

const Heatmap: React.FC<HeatmapCalendarProps> = ({
  habitId,
  startDate,
  endDate,
  events,
}) => {
  const diffDays = differenceInDays(endDate, startDate) + 1;
  const data = useMemo(() => {
    const dateRangeAsArray = range(0, diffDays).map((dayOffset) =>
      addDays(new Date(startDate), dayOffset),
    );

    const preparedData: PreparedDatum[] = dateRangeAsArray.reduce<
      PreparedDatum[]
    >((acc, date): PreparedDatum[] => {
      const eventForDate = events?.find((event) => isSameDay(event.date, date));

      if (eventForDate === undefined || eventForDate.value === 0) {
        acc.push({
          date,
          value: undefined,
          streak: undefined,
        });
        return acc;
      }

      const lastEntry = acc[acc.length - 1];
      if (lastEntry === undefined) {
        acc.push({
          date,
          value: eventForDate.value,
          streak: 1,
        });
        return acc;
      }

      if (
        differenceInDays(
          startOfDay(eventForDate.date),
          startOfDay(lastEntry.date),
        ) === 1
      ) {
        acc.push({
          date: date,
          value: eventForDate.value,
          streak: (lastEntry?.streak ?? 0) + 1,
        });
        return acc;
      }

      acc.push({
        date: date,
        value: eventForDate.value,
        streak: 1,
      });
      return acc;
    }, [] as PreparedDatum[]);

    return preparedData;
  }, [diffDays, events, startDate]);

  return (
    <div>
      <Container>
        {data.map(({ date, value, streak }) => (
          <Cell
            key={date.toString()}
            habitId={habitId}
            date={date}
            value={value}
            streak={streak}
          />
        ))}
      </Container>
    </div>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default Heatmap;
