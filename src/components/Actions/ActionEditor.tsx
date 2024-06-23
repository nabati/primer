import { TextField } from "@mui/material";
import React from "react";
import { Action } from "../../types.ts";

type ActionEditorProps = {
  action: Partial<Action>;
  onComplete: (action: Partial<Action> & { content: string }) => void;
  onCancel: () => void;
};

const ActionEditor: React.FC<ActionEditorProps> = ({
  action,
  onComplete,
  onCancel,
}) => {
  const [content, setContent] = React.useState(action?.content ?? "");
  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
      onComplete({ ...action, content });
    }

    if (event.key === "Escape") {
      onCancel();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.setSelectionRange(
      e.currentTarget.value.length,
      e.currentTarget.value.length,
    );
  };

  return (
    <TextField
      label="Action"
      variant="outlined"
      fullWidth
      multiline
      rows={2}
      margin="normal"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onKeyDown={handleKeyDown}
      autoFocus
      onFocus={handleFocus}
    />
  );
};

export default ActionEditor;
