import { TextField } from "@mui/material";
import React from "react";
import { Action } from "../../types.ts";

type ActionEditorProps = {
  action: Partial<Action> & { id: string };
  onComplete: (action: Partial<Action> & { content: string }) => void;
  onUpdate: (action: Partial<Action> & { content: string }) => void;
  onCancel: () => void;
  onCreateNewBefore?: () => void;
  onCreateNewAfter?: () => void;
};

const MAX_INDENTATION = 4;

const ActionEditor: React.FC<ActionEditorProps> = ({
  action,
  onComplete,
  onCancel,
  onUpdate,
  onCreateNewBefore,
  onCreateNewAfter,
}) => {
  const [content, setContent] = React.useState(action?.content ?? "");

  const complete = () => {
    onComplete({ ...action, content });
  };

  const handleBlur = () => {
    complete();
  };

  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      complete();
      return;
    }

    if (event.key === "Escape") {
      onCancel();
      return;
    }

    if (event.metaKey && event.key === "[") {
      event.preventDefault();
      onUpdate({
        ...action,
        content,
        indentation: Math.max(0, (action?.indentation ?? 0) - 1),
      });
      return;
    }

    if (event.metaKey && event.key === "]") {
      event.preventDefault();
      onUpdate({
        ...action,
        content,
        indentation: Math.min((action?.indentation ?? 0) + 1, MAX_INDENTATION),
      });
      return;
    }

    if (event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      onCreateNewAfter?.();
      return;
    }

    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      onCreateNewBefore?.();
      return;
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
      onBlur={handleBlur}
    />
  );
};

export default ActionEditor;
