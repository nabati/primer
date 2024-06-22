import React, { useState, useEffect } from "react";
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

type ViewPriorityProps = {
  id: string;
};

const ViewPriority: React.FC<ViewPriorityProps> = ({ id }) => {
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

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

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

      <ListHabits priorityId={id} />

      {id !== undefined && <AddHabitCard priorityId={id} />}
    </>
  );
};

export default ViewPriority;
