import Typography from "@mui/material/Typography";
import React from "react";
import useListHabits from "../hooks/useListHabits.ts";
import { Box, CircularProgress } from "@mui/material";
import HabitCard from "./HabitCard.tsx";

type ListHabitProps = {
  priorityId: string;
};

const ListHabits: React.FC<ListHabitProps> = ({ priorityId }) => {
  const { data: habits, error, isLoading } = useListHabits({ priorityId });

  if (isLoading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <>
      {habits?.map((habit) => (
        <Box key={habit.id} sx={{ py: 1 }}>
          <HabitCard id={habit.id} />
        </Box>
      ))}
    </>
  );
};

export default ListHabits;
