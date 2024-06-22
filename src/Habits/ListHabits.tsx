import Typography from "@mui/material/Typography";
import React from "react";
import { getSupabaseClient } from "../supabaseClient.ts";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress, Link } from "@mui/material";
import HabitCard from "./HabitCard.tsx";

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
    <>
      {habits.map((habit) => (
        <HabitCard key={habit.id} id={habit.id} />
      ))}
    </>
  );
};

export default ListHabits;
