import React from "react";
import useListNotes from "../../hooks/useListNotes.ts";
import Note from "./Note.tsx";

type ListNotesProps = {
  priorityId: string;
};

const ListNotes: React.FC<ListNotesProps> = ({ priorityId }) => {
  const { entries: notes } = useListNotes({ priorityId });
  return (
    <div>
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
};

export default ListNotes;
