import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getSupabaseClient } from "../supabaseClient.ts";
import { JournalEntry } from "../types.ts";
import { useUser } from "./AuthContext.tsx";
import JournalListCard from "./JournalListCard.tsx";

type JournalSidebarProps = {
  onSelect: (id: string) => void;
};

const JournalSidebar: React.FC<JournalSidebarProps> = ({ onSelect }) => {
  const queryClient = useQueryClient();
  const user = useUser();

  const { data: entries = [], isFetching } = useQuery({
    queryKey: ["journals"],
    queryFn: async (): Promise<any> => {
      const { data: entries } = await getSupabaseClient()
        .from("journals")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("is_archived", false);

      return entries;
    },
  });

  const createNewEntry = async () => {
    const { data: row } = await getSupabaseClient()
      .from("journals")
      .insert([{ content: "", user_id: user.id }])
      .select("*")
      .single<JournalEntry>();


    if (row === null) {
      return;
    }
    console.log("Should be invalidating");
    queryClient.invalidateQueries({ queryKey: ["journals"] });

    onSelect(row.id);
  };

  if (isFetching) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <div>
        <Button variant="contained" color="primary" onClick={createNewEntry}>
          Create new journal entry
        </Button>
      </div>
      {entries.map((entry: any) => (
        <JournalListCard
          entry={entry}
          key={entry.id}
          onClick={() => onSelect(entry.id)}
        />
      ))}
    </Box>
  );
};

export default JournalSidebar;
