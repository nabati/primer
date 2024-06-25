import { CheckCircle } from "@mui/icons-material";
import React from "react";
import Markdown from "react-markdown";
import { Action } from "../../types.ts";
import ActionEditor from "./ActionEditor.tsx";
import { Button, Stack } from "@mui/material";

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

  const handleComplete2: React.MouseEventHandler = (event) => {
    event.stopPropagation();
    onComplete({
      ...action,
      completed_at: new Date(),
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div
      // onClick={() => setIsEditing(true)}
      >
        <Stack direction="row">
          <Button onClick={handleComplete2}>
            <CheckCircle />
          </Button>
          <Markdown>{action?.content}</Markdown>
        </Stack>
      </div>
    );
  }

  return (
    <ActionEditor
      action={action}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
};

export default ActionEditorRow;
