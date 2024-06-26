import React from "react";
import Note, { Note as NoteType } from "./Note.tsx";

type ListNotesProps = {
  notes: NoteType[];
};

const ListNotes: React.FC<ListNotesProps> = ({ notes }) => {
  return (
    <div>
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
};

export default ListNotes;
