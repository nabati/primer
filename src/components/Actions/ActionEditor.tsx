import { TextareaAutosize } from "@mui/material";
import React from "react";
import { Action } from "../../types.ts";

type ActionEditorProps = {
  action: Partial<Action>;
  onComplete: (action: Partial<Action> & { content: string }) => void;
};

const ActionEditor: React.FC<ActionEditorProps> = ({ action, onComplete }) => {
  const [content, setContent] = React.useState(action?.content ?? "");
  const handleKeyDown: React.KeyboardEventHandler = (event) => {
    if (event.key === "Enter") {
      onComplete({ ...action, content });
    }
  };

  return (
    <TextareaAutosize
      onChange={(e) => setContent(e.target.value)}
      value={content}
      onKeyDown={handleKeyDown}
    />
  );
};

export default ActionEditor;
