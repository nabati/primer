import { Button, Card } from "@mui/material";
import React from "react";
import useCreateNote from "../../hooks/useCreateNote.ts";
import useListNotes from "../../hooks/useListNotes.ts";
import PriorityNoteEditor from "../PriorityNoteEditor.tsx";
import PriorityNote from "./PriorityNote.tsx";

type NotesProps = { priorityId: string };

const PriorityNotes: React.FC<NotesProps> = ({ priorityId }) => {
  const { entries: notes } = useListNotes({ priorityId });
  const createNote = useCreateNote();
  const [isCreatingNoteWithId, setIsCreatingNoteWithId] = React.useState<
    string | undefined
  >();

  const handleCreateNoteClick = async () => {
    const noteId = await createNote({ priorityId });
    setIsCreatingNoteWithId(noteId);
  };

  const notesWithoutCreatingNote = notes.filter(
    (note) => note.id !== isCreatingNoteWithId,
  );

  return (
    <Card sx={{ p: 1, my: 1 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateNoteClick}
        sx={{ mt: 2 }}
      >
        Create note
      </Button>

      {isCreatingNoteWithId && (
        <PriorityNoteEditor
          id={isCreatingNoteWithId}
          priorityId={priorityId}
          onComplete={() => setIsCreatingNoteWithId(undefined)}
        />
      )}

      <div>
        {notesWithoutCreatingNote.map((note) => (
          <PriorityNote key={note.id} note={note} />
        ))}
      </div>
    </Card>
  );
};

export default PriorityNotes;
