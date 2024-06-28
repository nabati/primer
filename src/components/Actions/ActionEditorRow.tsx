import { CheckCircle, CircleOutlined } from "@mui/icons-material";
import React from "react";
import Markdown from "react-markdown";
import styled from "styled-components";
import { Action } from "../../types.ts";
import ActionEditor from "./ActionEditor.tsx";
import { Stack } from "@mui/material";

type ActionEditorRowProps = {
  action: Action;
  priorityId: string;
  onUpdate: (action: Partial<Action> & { content: string }) => void;
  onComplete: (action: Partial<Action> & { content: string }) => void;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
};

const ActionEditorRow: React.FC<ActionEditorRowProps> = ({
  action,
  onUpdate,
  onComplete,
  onEdit,
  isEditing,
  onCancel,
}) => {
  const [isHovering, setIsHovering] = React.useState(false);

  const handleComplete2: React.MouseEventHandler = (event) => {
    event.stopPropagation();
    onComplete({
      ...action,
      completed_at: new Date(),
    });
  };

  if (!isEditing) {
    return (
      <Container $indentation={action.indentation ?? 0} onClick={onEdit}>
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
      </Container>
    );
  }

  return (
    <Container $indentation={action?.indentation ?? 0}>
      <ActionEditor
        action={action}
        onUpdate={onUpdate}
        onComplete={onComplete}
        onCancel={onCancel}
      />
    </Container>
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

const Container = styled.div<{ $indentation: number }>`
  padding-left: ${(props) => props.$indentation * 16}px;
`;

export default ActionEditorRow;
