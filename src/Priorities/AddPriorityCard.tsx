import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import useUser from "../hooks/useUser.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

const AddPriorityCard: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const user = useUser();

  const handleSave = async () => {
    setError("");
    setSuccess("");
    try {
      const { error } = await getSupabaseClient()
        .from("priorities")
        .insert([{ title, description, user_id: user.id }]);
      if (error) {
        throw error;
      }
      setSuccess("Priority card saved successfully!");
      setTitle("");
      setDescription("");
    } catch (error) {
      setError("Error saving priority card.");
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Add Priority Card
        </Typography>
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
          multiline
          rows={4}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

export default AddPriorityCard;
