import { CheckCircle, Pending } from "@mui/icons-material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useCallback } from "react";
import styled from "styled-components";
import Editor from "../components/Editor.tsx";
import useKeyboardShortcuts from "../components/NoteEditor/hooks/useKeyboardShortcuts.ts";
import usePersistence from "../components/NoteEditor/hooks/usePersistence.ts";
import usePreventUnloadIfUnsavedChanges from "../components/NoteEditor/hooks/usePreventUnloadIfUnsavedChanges.ts";
import getFormattedDate from "../utils/getFormattedDate.ts";

type PriorityNoteEditorProps = {
  id: string;
  priorityId?: string;
};

const PriorityNoteEditor: React.FC<PriorityNoteEditorProps> = ({
  id,
  priorityId,
}) => {
  const { note, isFetching, onEditorContentChange, save, hasUnsavedChanges } =
    usePersistence({
      id,
      priorityId,
    });

  const handleChange = useCallback(
    (content: string) => {
      onEditorContentChange(content);
    },
    [onEditorContentChange],
  );

  usePreventUnloadIfUnsavedChanges({ hasUnsavedChanges, save });
  useKeyboardShortcuts({ save });

  if (isFetching) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      style={{ position: "relative", display: "flex", flexDirection: "column" }}
    >
      <TopBarContainer>
        <DateContainer>{getFormattedDate(note?.created_at)}</DateContainer>
        <StatusContainer>
          {!hasUnsavedChanges ? (
            <CheckCircle color="success" />
          ) : (
            <Pending color="disabled" />
          )}
        </StatusContainer>
      </TopBarContainer>
      <EditorContainer>
        <Editor onChange={handleChange} initialValue={note?.content ?? ""} />
      </EditorContainer>
    </Box>
  );
};

const DateContainer = styled.div`
  font-weight: bold;
`;

const TopBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StatusContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-self: stretch;
`;

export default PriorityNoteEditor;