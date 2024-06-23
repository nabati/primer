import { Button, Card } from "@mui/material";
import React from "react";
import useCreateNote from "../hooks/useCreateNote.ts";
import PriorityNoteEditor from "./PriorityNoteEditor.tsx";

type NotesProps = { priorityId: string };

const Notes: React.FC<NotesProps> = ({ priorityId }) => {
  const createNote = useCreateNote();
  const [isEditingNoteId, setIsEditingNoteId] = React.useState<
    string | undefined
  >();

  const handleCreateNoteClick = async () => {
    const noteId = await createNote({ priorityId });
    setIsEditingNoteId(noteId);
  };

  return (
    <Card>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNoteClick}
        sx={{ mt: 2 }}
      >
        Create note
      </Button>

      {isEditingNoteId && (
        <PriorityNoteEditor id={isEditingNoteId} priorityId={priorityId} />
      )}
    </Card>
  );
};

export default Notes;
