import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import useUser from "../hooks/useUser.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

type AddHabitCardProps = {
  priorityId: string;
};

const AddHabitCard: React.FC<AddHabitCardProps> = ({ priorityId }) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = useUser();

  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      const { error } = await getSupabaseClient()
        .from("habits")
        .insert([
          { title, type: "numeric", user_id: user.id, priority_id: priorityId },
        ]);
      if (error) {
        throw error;
      }
      setSuccess("Habit card saved successfully!");
      setTitle("");
    } catch (error) {
      setError("Error saving habit card.");
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Add Habit
        </Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success">{success}</Typography>}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          Save
        </Button>
      </CardContent>
    </Card>
  );
};

export default AddHabitCard;
