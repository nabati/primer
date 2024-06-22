import { CheckCircle, Pending, Delete } from "@mui/icons-material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { LexicalEditor } from "lexical";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import getFormattedDate from "../../utils/getFormattedDate.ts";
import Editor from "../Editor.tsx";
import usePersistence from "./hooks/usePersistence.ts";
import usePreventUnloadIfUnsavedChanges from "./hooks/usePreventUnloadIfUnsavedChanges.ts";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts.ts";

type NoteEditorProps = {
  id: string;
  onChange?: (content: string) => void;
  editorRef: React.RefObject<LexicalEditor>;
  priorityId?: string;
};

const NoteEditor: React.FC<NoteEditorProps> = ({
  id,
  onChange,
  editorRef,
  priorityId,
}) => {
  const navigate = useNavigate();

  const {
    note,
    isFetching,
    onEditorContentChange,
    save,
    del,
    hasUnsavedChanges,
  } = usePersistence({
    id,
    priorityId,
  });

  const handleChange = useCallback(
    (content: string) => {
      onEditorContentChange(content);
      onChange?.(content);
    },
    [onChange, onEditorContentChange],
  );

  usePreventUnloadIfUnsavedChanges({ hasUnsavedChanges, save });
  useKeyboardShortcuts({ save });

  const handleDeleteClick = async () => {
    if (confirm(`Are you sure you want to delete this note entry? ${id}`)) {
      await del();
      navigate("/notes");
    }
  };

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
          <Delete color="error" onClick={handleDeleteClick} />
        </StatusContainer>
      </TopBarContainer>
      <EditorContainer>
        <Editor
          onChange={handleChange}
          initialValue={note?.content ?? ""}
          editorRef={editorRef}
        />
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

export default NoteEditor;
