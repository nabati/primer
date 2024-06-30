import { CheckCircle, CircleOutlined } from "@mui/icons-material";
import { Stack } from "@mui/material";
import React from "react";
import Markdown from "react-markdown";
import styled from "styled-components";
import { Action } from "../../types.ts";
import IndentationContainer from "./IndentationContainer.tsx";

type ActionViewProps = {
  action: Action;
  onClick: () => void;
  onComplete: () => void;
};

const ActionView: React.FC<ActionViewProps> = ({
  action,
  onClick,
  onComplete,
}) => {
  const [isHovering, setIsHovering] = React.useState(false);

  const handleComplete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onComplete();
  };

  return (
    <IndentationContainer
      $indentation={action.indentation ?? 0}
      onClick={onClick}
    >
      <Stack direction="row" gap={0}>
        <CheckmarkButton
          onClick={handleComplete}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering ? <CheckCircle /> : <CircleOutlined />}
        </CheckmarkButton>
        <StyledMarkdown>{action?.content}</StyledMarkdown>
      </Stack>
    </IndentationContainer>
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

export default ActionView;
