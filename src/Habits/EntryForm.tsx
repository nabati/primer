import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { getSupabaseClient } from "../supabaseClient.ts";
import { useUser } from "../components/AuthContext.tsx";

type EntryFormProps = {
  habitId: string;
};

type Entry = {
  id?: string;
  date: string;
  value: number;
  habit_id: string;
  user_id: string;
};

const fetchEntryByDate = async (date: string, habitId: string) => {
  const { data, error } = await getSupabaseClient()
    .from("events")
    .select("*")
    .eq("date", date)
    .eq("habit_id", habitId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(error.message);
  }

  return data;
};

const upsertEntry = async (entry: Entry) => {
  const { data, error } = await getSupabaseClient()
    .from("events")
    .upsert(entry, { onConflict: ["date", "habit_id"] });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const EntryForm: React.FC<EntryFormProps> = ({ habitId }) => {
  const user = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [value, setValue] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: entry } = useQuery({
    queryKey: ["entry", selectedDate],
    queryFn: () =>
      fetchEntryByDate(format(selectedDate!, "yyyy-MM-dd"), habitId),
    enabled: !!selectedDate,
  });

  const mutation = useMutation({
    mutationFn: upsertEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entry", selectedDate] });
    },
  });

  useEffect(() => {
    if (entry) {
      setValue(entry.value);
    } else {
      setValue(null);
    }
  }, [entry]);

  const handleSave = async () => {
    if (selectedDate && value !== null) {
      const newEntry: Entry = {
        date: format(selectedDate, "yyyy-MM-dd"),
        value,
        habit_id: habitId,
        user_id: user.id,
      };

      await mutation.mutateAsync(newEntry);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <DatePicker
        label="Select Date"
        value={selectedDate}
        onChange={(newValue) => setSelectedDate(newValue)}
        // renderInput={(params) => <TextField {...params} />}
      />
      <TextField
        label="Value"
        type="number"
        value={value ?? ""}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default EntryForm;
