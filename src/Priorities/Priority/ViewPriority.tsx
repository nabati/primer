import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddHabitCard from "../../Habits/AddHabitCard.tsx";
import ListHabits from "../../Habits/ListHabits.tsx";
import { getSupabaseClient } from "../../supabaseClient.ts";
import Calendar from "./Calendar.tsx";

interface Priority {
  id: string;
  title: string;
  description: string;
}

const fetchPriority = async (id: string): Promise<Priority> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("priorities")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

const updatePriority = async ({
  id,
  title,
  description,
}: Priority): Promise<void> => {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("priorities")
    .update({ title, description })
    .eq("id", id);
  if (error) throw new Error(error.message);
};

const ViewPriority: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const {
    data: priority,
    error,
    isLoading,
  } = useQuery<Priority, Error>({
    queryKey: ["priority", id],
    queryFn: () => fetchPriority(id),
  });
  const mutation = useMutation<void, Error, Priority>({
    mutationFn: updatePriority,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["priority", id],
      });
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (priority) {
      setTitle(priority.title);
      setDescription(priority.description);
    }
  }, [priority]);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">{error.message}</Typography>;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (priority) {
      mutation.mutate({ id: priority.id, title, description });
      setIsEditing(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          {isEditing ? (
            <>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                Save
              </Button>
            </>
          ) : (
            priority !== undefined && (
              <>
                <Typography variant="h5" component="div">
                  {priority.title}
                </Typography>
                <Typography variant="body1" component="div">
                  {priority.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  sx={{ mt: 2 }}
                >
                  Edit
                </Button>
              </>
            )
          )}
        </CardContent>
      </Card>

      <hr />

      {/*<Calendar*/}
      {/*  startDate="2023-06-01"*/}
      {/*  endDate="2023-06-30"*/}
      {/*  events={[*/}
      {/*    { date: "2023-05-01", value: true },*/}
      {/*    { date: "2023-05-02", value: true },*/}
      {/*    { date: "2023-05-03", value: false },*/}
      {/*    { date: "2023-05-04", value: true },*/}
      {/*    { date: "2023-05-05", value: true },*/}
      {/*    { date: "2023-05-06", value: true },*/}
      {/*    { date: "2023-05-07", value: true },*/}
      {/*    { date: "2023-05-08", value: false },*/}
      {/*    { date: "2023-05-09", value: true },*/}
      {/*    { date: "2023-05-10", value: true },*/}
      {/*    { date: "2023-05-11", value: true },*/}
      {/*    { date: "2023-05-12", value: false },*/}
      {/*    { date: "2023-05-13", value: true },*/}
      {/*    { date: "2023-05-14", value: true },*/}
      {/*    { date: "2023-05-15", value: true },*/}
      {/*    { date: "2023-05-16", value: false },*/}
      {/*    { date: "2023-05-17", value: true },*/}
      {/*    { date: "2023-05-18", value: true },*/}
      {/*    { date: "2023-05-19", value: true },*/}
      {/*    { date: "2023-05-20", value: true },*/}
      {/*    { date: "2023-05-21", value: true },*/}
      {/*    { date: "2023-05-22", value: true },*/}
      {/*    { date: "2023-05-23", value: false },*/}
      {/*    { date: "2023-05-24", value: true },*/}
      {/*    { date: "2023-05-25", value: true },*/}
      {/*    { date: "2023-05-26", value: true },*/}
      {/*    { date: "2023-05-27", value: false },*/}
      {/*    { date: "2023-05-28", value: true },*/}
      {/*    { date: "2023-05-29", value: true },*/}
      {/*    { date: "2023-05-30", value: true },*/}
      {/*    { date: "2023-05-31", value: true },*/}
      {/*    { date: "2023-06-01", value: true },*/}
      {/*    { date: "2023-06-02", value: true },*/}
      {/*    { date: "2023-06-03", value: true },*/}
      {/*    { date: "2023-06-04", value: true },*/}
      {/*  ]}*/}
      {/*/>*/}

      <hr />

      {/*<Calendar*/}
      {/*  startDate="2023-06-01"*/}
      {/*  endDate="2023-06-30"*/}
      {/*  events={[*/}
      {/*    { date: "2023-05-01", value: 5 },*/}
      {/*    { date: "2023-05-02", value: 8 },*/}
      {/*    { date: "2023-05-03", value: 6 },*/}
      {/*    { date: "2023-05-04", value: 7 },*/}
      {/*    { date: "2023-05-05", value: 10 },*/}
      {/*    { date: "2023-05-06", value: 12 },*/}
      {/*    { date: "2023-05-07", value: 15 },*/}
      {/*    { date: "2023-05-08", value: 3 },*/}
      {/*    { date: "2023-05-09", value: 9 },*/}
      {/*    { date: "2023-05-10", value: 10 },*/}
      {/*    { date: "2023-05-11", value: 11 },*/}
      {/*    { date: "2023-05-12", value: 5 },*/}
      {/*    { date: "2023-05-13", value: 8 },*/}
      {/*    { date: "2023-05-14", value: 9 },*/}
      {/*    { date: "2023-05-15", value: 10 },*/}
      {/*    { date: "2023-05-16", value: 4 },*/}
      {/*    { date: "2023-05-17", value: 7 },*/}
      {/*    { date: "2023-05-18", value: 6 },*/}
      {/*    { date: "2023-05-19", value: 10 },*/}
      {/*    { date: "2023-05-20", value: 12 },*/}
      {/*    { date: "2023-05-21", value: 14 },*/}
      {/*    { date: "2023-05-22", value: 11 },*/}
      {/*    { date: "2023-05-23", value: 13 },*/}
      {/*    { date: "2023-05-24", value: 5 },*/}
      {/*    { date: "2023-05-25", value: 8 },*/}
      {/*    { date: "2023-05-26", value: 9 },*/}
      {/*    { date: "2023-05-27", value: 10 },*/}
      {/*    { date: "2023-05-28", value: 7 },*/}
      {/*    { date: "2023-05-29", value: 6 },*/}
      {/*    { date: "2023-05-30", value: 10 },*/}
      {/*    { date: "2023-05-31", value: 12 },*/}
      {/*    { date: "2023-06-01", value: 15 },*/}
      {/*    { date: "2023-06-02", value: 16 },*/}
      {/*    { date: "2023-06-03", value: 14 },*/}
      {/*    { date: "2023-06-04", value: 17 },*/}
      {/*  ]}*/}
      {/*  minDailyGoalValue={7}*/}
      {/*/>*/}

      <ListHabits priorityId={id} />

      {id !== undefined && <AddHabitCard priorityId={id} />}
    </>
  );
};

export default ViewPriority;
