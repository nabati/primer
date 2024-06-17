import React from "react";
import { useParams } from "react-router-dom";
import EntryForm from "./EntryForm";

type ViewHabitProps = {};

const ViewHabit: React.FC<ViewHabitProps> = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <div>Habit</div>

      <div>Habit tracker calendar 1.</div>

      <div>
        <EntryForm habitId={id} />
      </div>

      <div>Notes?</div>
    </div>
  );
};

export default ViewHabit;
