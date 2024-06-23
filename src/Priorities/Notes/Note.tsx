import EditIcon from "@mui/icons-material/Edit";
import { Button } from "@mui/material";
import React from "react";
import type { Note as NoteType } from "../../types.ts";
import getFormattedDate from "../../utils/getFormattedDate.ts";
import PriorityNoteEditor from "../PriorityNoteEditor.tsx";
import Markdown from "react-markdown";

type NoteProps = {
  note: NoteType;
};

const Note: React.FC<NoteProps> = ({ note, ...props }) => {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  return (
    <div>
      {!isEditing && (
        <div>
          <b>{getFormattedDate(note.updated_at)}</b>.
          <Markdown>{note.content}</Markdown>
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            sx={{ mt: 2 }}
          >
            <EditIcon />
          </Button>
        </div>
      )}
      {isEditing && (
        <PriorityNoteEditor
          id={note.id}
          priorityId={note.priority_id}
          onComplete={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default Note;
