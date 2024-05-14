import { CheckCircle, Pending } from "@mui/icons-material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { LexicalEditor } from "lexical";
import throttle from "lodash/throttle";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [lastSavedEditorContent, setLastSavedEditorContent] =
    useState<string>("");

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
      setLastSavedEditorContent(entry.content);

      return entry;
    },
  });

  const save = useCallback(async () => {
    await getSupabaseClient().from("journals").upsert({
      id,
      content: editorContent.current,
      user_id: user.id,
    });
    setLastSavedEditorContent(editorContent.current);
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
      onChange?.(content);
      throttledSave();
    },
    [throttledSave],
  );

  useEffect(() => {
    const handleBeforeUnload = (event: Event) => {
      if (editorContent.current === lastSavedEditorContent) {
        return;
      }

      event.preventDefault();
      save();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [save, lastSavedEditorContent]);

  useEffect(() => {
    const handleSave = (event: KeyboardEvent) => {
      if (event.key === "s" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        save();
      }
    };

    window.addEventListener("keydown", handleSave);

    return () => {
      window.removeEventListener("keydown", handleSave);
    };
  }, [save]);

  if (isFetching) {
    return (
      <Box>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box style={{ position: "relative" }}>
      <StatusContainer>
        {editorContent.current === lastSavedEditorContent ? (
          <CheckCircle color="success" />
        ) : (
          <Pending color="disabled" />
        )}
      </StatusContainer>
      <EditorContainer>
        <Editor
          onChange={handleChange}
          initialValue={journalEntry?.content ?? ""}
          editorRef={editorRef}
        />
      </EditorContainer>
    </Box>
  );
};

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

export default JournalEditor;
