import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React from "react";
import { getSupabaseClient } from "../supabaseClient.ts";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress, Link } from "@mui/material";

const fetchHabits = async ({ priorityId }: { priorityId: string }) => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("priority_id", priorityId);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

type ListHabitProps = {
  priorityId: string;
};

const ListHabits: React.FC<ListHabitProps> = ({ priorityId }) => {
  const {
    data: habits,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["habits"],
    queryFn: () => fetchHabits({ priorityId }),
  });

  if (isLoading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {habits.map((habit) => (
            <TableRow key={habit.id}>
              <TableCell>
                <Link href={`/habits/${habit.id}`} underline="hover">
                  {habit.title}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListHabits;
