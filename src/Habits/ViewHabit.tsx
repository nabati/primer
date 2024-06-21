import { subDays } from "date-fns";
import range from "lodash/range";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import EntryForm from "./EntryForm";

import Heatmap from "./Heatmap/Heatmap.tsx";
import useEvents from "./hooks/useEvents.ts";

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

      {/*<div>*/}
      {/*  <TableContainer component={Paper}>*/}
      {/*    <Table size="small">*/}
      {/*      <TableHead>*/}
      {/*        <TableRow>*/}
      {/*          <TableCell>Date</TableCell>*/}
      {/*          <TableCell>Value</TableCell>*/}
      {/*        </TableRow>*/}
      {/*      </TableHead>*/}
      {/*      <TableBody>*/}
      {/*        {dates.map((date) => (*/}
      {/*          <TableRow key={date.toISOString()}>*/}
      {/*            <TableCell>{format(date, "yyyy-MM-dd")}</TableCell>*/}
      {/*            <TableCell>*/}
      {/*              {events?.[format(date, "yyyy-MM-dd")] !== undefined*/}
      {/*                ? events?.[format(date, "yyyy-MM-dd")]?.value*/}
      {/*                : ""}*/}
      {/*            </TableCell>*/}
      {/*          </TableRow>*/}
      {/*        ))}*/}
      {/*        <TableRow>*/}
      {/*          <TableCell>*/}
      {/*            <b>Sum</b>*/}
      {/*          </TableCell>*/}
      {/*          <TableCell>*/}
      {/*            <b>*/}
      {/*              {dates.reduce((sum, date) => {*/}
      {/*                return (*/}
      {/*                  sum + (events?.[format(date, "yyyy-MM-dd")]?.value ?? 0)*/}
      {/*                );*/}
      {/*              }, 0)}*/}
      {/*            </b>*/}
      {/*          </TableCell>*/}
      {/*        </TableRow>*/}
      {/*      </TableBody>*/}
      {/*    </Table>*/}
      {/*  </TableContainer>*/}
      {/*</div>*/}

      <div>Notes?</div>
    </div>
  );
};

export default ViewHabit;
