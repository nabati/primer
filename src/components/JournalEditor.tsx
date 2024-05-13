import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { LexicalEditor } from "lexical";
import throttle from "lodash/throttle";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { getSupabaseClient } from "../supabaseClient.ts";
import { useUser } from "./AuthContext.tsx";
import Editor from "./Editor.tsx";

type JournalEditorProps = {
  id: string;
  onChange?: (content: string) => void;
  editorRef: React.RefObject<LexicalEditor>;
};

const JournalEditor: React.FC<JournalEditorProps> = ({
  id,
  onChange,
  editorRef,
}) => {
  const user = useUser();
  const editorContent = useRef<string>("");
  const lastSavedEditorContent = useRef<string>("");

  // Get today's journal entry, if it exists.
  const { data: journalEntry, isFetching } = useQuery({
    queryKey: ["journals-entry", id],
    queryFn: async (): Promise<any> => {
      const { data: entries } = await getSupabaseClient()
        .from("journals")
        .select("*")
        .eq("id", id);

      if (entries === null || entries?.length === 0) {
        return undefined;
      }

      const entry = entries[0];
      editorContent.current = entry.content;
      lastSavedEditorContent.current = entry.content;

      return entry;
    },
  });

  const save = useCallback(async () => {
    await getSupabaseClient().from("journals").upsert({
      id,
      content: editorContent.current,
      user_id: user.id,
    });
    lastSavedEditorContent.current = editorContent.current;
  }, [id, user.id]);

  const throttledSave = useMemo(
    () =>
      throttle(() => {
        save();
      }, 1000),
    [save],
  );

  const handleChange = useCallback(
    (content: string) => {
      editorContent.current = content;
      onChange(content);
      throttledSave();
    },
    [throttledSave],
  );

  useEffect(() => {
    const handleBeforeUnload = (event: Event) => {
      if (editorContent.current === lastSavedEditorContent.current) {
        return;
      }

      event.preventDefault();
      save();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [save]);

  if (isFetching) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  if (journalEntry === undefined) {
    return (
      <Box>
        <p>Journal entry not found</p>
      </Box>
    );
  }

  return (
    <Box>
      <EditorContainer>
        <Editor
          onChange={handleChange}
          initialValue={journalEntry.content}
          editorRef={editorRef}
        />
      </EditorContainer>
    </Box>
  );
};

const EditorContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-self: stretch;
`;

export default JournalEditor;
