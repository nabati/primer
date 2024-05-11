import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format, startOfDay } from "date-fns";
import {
  $createLineBreakNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  EditorState,
  LexicalEditor,
} from "lexical";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import Stack from "../Stack.tsx";
import { getSupabaseClient } from "../supabaseClient.ts";
import { useUser } from "./AuthContext.tsx";
import Editor from "./Editor";
import throttle from "lodash/throttle";
import { v4 as uuidv4 } from "uuid";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";

type JournalProps = {
  //
};

type JournalEntry = {
  id: string;
  content: string;
};

const getFormattedDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy");
};

const getDefaultContent = (): string => {
  return `**${getFormattedDate(new Date())}**`;
};

const getDefaultEntry = (): JournalEntry => ({
  id: uuidv4(),
  content: getDefaultContent(),
});

const Journal: React.FC<JournalProps> = () => {
  const editorRef = useRef<LexicalEditor | null>(null);
  const editorContent = useRef<string>("");
  const lastSavedEditorContent = useRef<string>("");
  const user = useUser();

  // Get today's journal entry, if it exists.
  const { data: initialJournalEntry, isFetching } = useQuery({
    queryKey: ["journals"],
    queryFn: async (): Promise<JournalEntry | null> => {
      const { data: entries } = await getSupabaseClient()
        .from("journals")
        .select("*")
        .gte("created_at", startOfDay(new Date()).toISOString())
        .lte("created_at", endOfDay(new Date()).toISOString());

      if (entries === null) {
        return getDefaultEntry();
      }

      if (entries.length === 0) {
        return getDefaultEntry();
      }

      const entry = entries[0];
      return {
        ...entry,
        content:
          entry.content.length === 0 ? getDefaultContent() : entry.content,
      };
    },
    initialData: null,
  });

  console.log("@@ini", initialJournalEntry);

  useEffect(() => {
    if (initialJournalEntry === null) {
      return;
    }

    editorContent.current = initialJournalEntry.content;
    lastSavedEditorContent.current = initialJournalEntry.content;
  }, [initialJournalEntry]);

  const entryUuid = useMemo(() => {
    return initialJournalEntry?.id ?? uuidv4();
  }, [initialJournalEntry]);

  const save = useCallback(async () => {
    await getSupabaseClient().from("journals").upsert({
      id: entryUuid,
      content: editorContent.current,
      user_id: user.id,
    });
    lastSavedEditorContent.current = editorContent.current;
  }, [entryUuid, user]);

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
      console.log(`@@onChange content:'${content}'`);
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

  const handleSwipeRight = (prompt: string) => {
    const editor = editorRef.current;

    if (editor === null) {
      return;
    }

    editor.update(() => {
      // Insert two new lines at the ned of the editor, append the prompt in bolded text and add another new line.
      $getRoot().selectEnd();
      const selection = $getSelection();
      selection?.insertNodes([
        $createLineBreakNode(),
        $createLineBreakNode(),
        $createTextNode(prompt).setFormat("bold"),
        $createLineBreakNode(),
      ]);
    });
  };

  if (isFetching) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Editor
        onChange={handleChange}
        initialValue={initialJournalEntry?.content}
        editorRef={editorRef}
      />
      <Stack onSwipeRight={handleSwipeRight} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 128px);
`;

export default Journal;
