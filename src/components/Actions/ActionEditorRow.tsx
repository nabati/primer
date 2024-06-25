import { CheckCircle, CircleOutlined } from "@mui/icons-material";
import React from "react";
import Markdown from "react-markdown";
import styled from "styled-components";
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
  const [isHovering, setIsHovering] = React.useState(false);

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
        <Stack direction="row" gap={0}>
          <CheckmarkButton
            onClick={handleComplete2}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {isHovering ? <CheckCircle /> : <CircleOutlined />}
          </CheckmarkButton>
          <StyledMarkdown>{action?.content}</StyledMarkdown>
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

const CheckmarkButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  padding: 4px;
  cursor: pointer;
`;

const StyledMarkdown = styled(Markdown)`
  display: flex;
  align-items: center;
  padding: 4px;
`;

export default ActionEditorRow;
