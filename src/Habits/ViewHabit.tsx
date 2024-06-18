import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import range from "lodash/range";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../components/AuthContext.tsx";
import { getSupabaseClient } from "../supabaseClient.ts";
import EntryForm from "./EntryForm";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { keyBy, mapValues } from "lodash";
import Heatmap from "./Heatmap/Heatmap.tsx";

type ViewHabitProps = {};

const ViewHabit: React.FC<ViewHabitProps> = () => {
  const { id } = useParams<{ id: string }>();
  const user = useUser();

  const { dates, startDate, endDate } = useMemo(() => {
    const today = new Date();
    const dates = range(0, 30).map((i) => subDays(today, i));
    return {
      dates,
      startDate: dates[dates.length - 1],
      endDate: dates[0],
    };
  }, []);

  const { data: events } = useQuery({
    queryKey: ["events", id, startDate, endDate],
    queryFn: async () => {
      const { data: events } = await getSupabaseClient()
        .from("events")
        .select("*")
        .eq("habit_id", id)
        .eq("user_id", user.id)
        .gte("date", format(startDate, "yyyy-MM-dd"))
        .lte("date", format(endDate, "yyyy-MM-dd"));

      return events;
    },
  });

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
