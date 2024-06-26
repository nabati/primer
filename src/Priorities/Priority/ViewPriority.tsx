import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import styled from "styled-components";
import Actions from "../../components/Actions/Actions.tsx";
import ListHabits from "../../Habits/ListHabits.tsx";
import useDeletePriority from "../../hooks/useDeletePriority.ts";
import { getSupabaseClient } from "../../supabaseClient.ts";
import AddHabitCard from "../../Habits/AddHabitCard.tsx";
import PriorityNotes from "../Notes/PriorityNotes.tsx";

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

  const { deletePriority } = useDeletePriority();
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

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this priority?")) {
      await deletePriority({ id });
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
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ mt: 2 }}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  sx={{ mt: 2 }}
                >
                  Delete
                </Button>
              </Stack>
            </>
          ) : (
            priority !== undefined && (
              <>
                <Stack direction="row" alignItems="center" gap={0}>
                  <Typography variant="h5" component="div">
                    {priority.title}
                  </Typography>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleEdit}
                    size="small"
                    startIcon={<EditIcon />}
                  />
                </Stack>
                <Typography variant="body1" component="div">
                  {priority.description}
                </Typography>
              </>
            )
          )}
        </CardContent>
      </Card>

      <Columns>
        <Column>
          <ListHabits priorityId={id} />
          {id !== undefined && (
            <Box sx={{ py: 1 }}>
              <AddHabitCard priorityId={id} />
            </Box>
          )}
        </Column>

        <Column>
          <PriorityNotes priorityId={id} />
        </Column>

        <Column>
          <Actions priorityId={id} />
        </Column>
      </Columns>
    </>
  );
};

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
`;

const Column = styled.div``;

export default ViewPriority;
