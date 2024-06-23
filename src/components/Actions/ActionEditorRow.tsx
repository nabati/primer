import React from "react";
import Markdown from "react-markdown";
import { Action } from "../../types.ts";
import ActionEditor from "./ActionEditor.tsx";

type ActionEditorRowProps = {
  action: Action;
  priorityId: string;
  onComplete: (action: Partial<Action> & { content: string }) => void;
};

const ActionEditorRow: React.FC<ActionEditorRowProps> = ({
  action,
  onComplete,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleComplete = (action: Partial<Action> & { content: string }) => {
    setIsEditing(false);
    onComplete(action);
  };

  if (!isEditing) {
    return (
      <div onClick={() => setIsEditing(true)}>
        <Markdown>{action?.content}</Markdown>
      </div>
    );
  }

  return <ActionEditor action={action} onComplete={handleComplete} />;
};

export default ActionEditorRow;
