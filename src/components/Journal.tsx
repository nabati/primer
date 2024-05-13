import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, startOfDay } from "date-fns";
import {
  $createLineBreakNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  LexicalEditor,
} from "lexical";
import React, { useRef, useState } from "react";
import styled from "styled-components";
import Stack from "../Stack.tsx";
import { getSupabaseClient } from "../supabaseClient.ts";
import getFormattedDate from "../utils/getFormattedDate.ts";
import Coach from "./Coach.tsx";
import { v4 as uuidv4 } from "uuid";
import { $createListNode, $createListItemNode } from "@lexical/list";
import JournalEditor from "./JournalEditor.tsx";
import JournalSidebar from "./JournalSidebar.tsx";

type JournalProps = {
  //
};

type JournalEntry = {
  id: string;
  content: string;
};

const Journal: React.FC<JournalProps> = () => {
  const [editorContentStateful, setEditorContentStateful] =
    useState<string>("");
  const editorRef = useRef<LexicalEditor | null>(null);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    null,
  );

  // Get today's journal entry, if it exists.
  const { data: todaysJournalEntryId, isFetching } = useQuery({
    queryKey: ["journals-today", getFormattedDate(new Date())],
    queryFn: async (): Promise<string> => {
      const { data: entries } = await getSupabaseClient()
        .from("journals")
        .select("*")
        .gte("created_at", startOfDay(new Date()).toISOString())
        .lte("created_at", endOfDay(new Date()).toISOString());

      if (entries === null || entries.length === 0) {
        return uuidv4();
      }

      return entries[0].id;
    },
  });

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
        $createLineBreakNode(),
        $createTextNode(prompt).setFormat("bold"),
        $createLineBreakNode(),
        $createListNode("bullet").append($createListItemNode()),
      ]);
    });
  };

  if (isFetching) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <JournalSidebar onSelect={(id) => setSelectedJournalId(id)} />

      {todaysJournalEntryId !== undefined && (
        <JournalEditor
          id={selectedJournalId ?? todaysJournalEntryId}
          onChange={setEditorContentStateful}
          editorRef={editorRef}
        />
      )}
      <Sidebar>
        <Stack onSwipeRight={handleSwipeRight} />
        <Coach content={editorContentStateful} />
      </Sidebar>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  grid-template-rows: 1fr;
  height: calc(100vh - 128px);
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: center;
  flex-grow: 1;
`;

export default Journal;
