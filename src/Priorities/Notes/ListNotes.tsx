import React from "react";
import useNotes from "../../hooks/useNotes.ts";
import Note from "./Note.tsx";

type ListNotesProps = {
  priorityId: string;
};

const ListNotes: React.FC<ListNotesProps> = ({ priorityId }) => {
  const { entries: notes } = useNotes({ priorityId });
  return (
    <div>
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
};

export default ListNotes;
