import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import { Note } from "../types.ts";
import JournalListCard from "./JournalListCard.tsx";
import AddIcon from "@mui/icons-material/Add";

type JournalSidebarProps = {
  entries: Note[];
  onSelect: (id: string) => void;
  isLoading: boolean;
  onCreateClick: () => void;
};

const JournalSidebar: React.FC<JournalSidebarProps> = ({
  onSelect,
  entries,
  isLoading,
  onCreateClick,
}) => {
  if (isLoading) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box style={{ height: "100%", overflow: "scroll" }}>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={onCreateClick}
          startIcon={<AddIcon />}
        >
          Create journal entry
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
