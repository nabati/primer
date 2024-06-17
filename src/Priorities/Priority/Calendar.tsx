import React from "react";
import { eachDayOfInterval, format, isSameDay, parseISO } from "date-fns";
import { Box, Typography } from "@mui/material";

interface Event {
  date: string;
  value: boolean | number;
}

interface CalendarProps {
  startDate: string;
  endDate: string;
  events: Event[];
  minDailyGoalValue?: number;
}

const Calendar: React.FC<CalendarProps> = ({
  startDate,
  endDate,
  events,
  minDailyGoalValue,
}) => {
  const days = eachDayOfInterval({
    start: parseISO(startDate),
    end: parseISO(endDate),
  });

  const getIntensity = (count: number) => {
    const colors = ["#e6ffe6", "#ccffcc", "#b3ffb3", "#99ff99", "#80ff80"];
    return colors[Math.min(count, colors.length - 1)];
  };

  const getDayColor = (currentDate: Date) => {
    const event = events.find((event) =>
      isSameDay(parseISO(event.date), currentDate),
    );
    if (!event) return "white";

    if (typeof event.value === "boolean") {
      const streak = events.reduce((acc, curr, index) => {
        if (isSameDay(parseISO(curr.date), currentDate)) {
          let count = 0;
          for (let i = index; i >= 0; i--) {
            if (events[i].value === true) count++;
            else break;
          }
          return count;
        }
        return acc;
      }, 0);
      return event.value ? getIntensity(streak) : "white";
    }

    if (typeof event.value === "number") {
      const streak = events.reduce((acc, curr, index) => {
        if (isSameDay(parseISO(curr.date), currentDate)) {
          let count = 0;
          for (let i = index; i >= 0; i--) {
            if (events[i].value >= (minDailyGoalValue || 0)) count++;
            else break;
          }
          return count;
        }
        return acc;
      }, 0);
      return event.value >= (minDailyGoalValue || 0)
        ? getIntensity(streak)
        : "white";
    }

    return "white";
  };

  return (
    <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
      {days.map((day) => (
        <Box
          key={format(day, "yyyy-MM-dd")}
          bgcolor={getDayColor(day)}
          display="flex"
          alignItems="center"
          justifyContent="center"
          width={40}
          height={40}
          border={1}
          borderColor="grey.300"
        >
          <Typography variant="caption">
            {events.find((event) => isSameDay(parseISO(event.date), day))
              ?.value ?? ""}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Calendar;
