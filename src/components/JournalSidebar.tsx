import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getSupabaseClient } from "../supabaseClient.ts";
import JournalListCard from "./JournalListCard.tsx";

type JournalSidebarProps = {
  onSelect: (id: string) => void;
};

const JournalSidebar: React.FC<JournalSidebarProps> = ({ onSelect }) => {
  const { data: entries = [], isFetching } = useQuery({
    queryKey: ["journals"],
    queryFn: async (): Promise<any> => {
      const { data: entries } = await getSupabaseClient()
        .from("journals")
        .select("*")
        .order("created_at", { ascending: false });

      return entries;
    },
  });

  if (isFetching) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
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
