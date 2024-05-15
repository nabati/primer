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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const JournalPage: React.FC<JournalProps> = () => {
  const navigate = useNavigate();
  const { id: selectedJournalId } = useParams();
  const [editorContentStateful, setEditorContentStateful] =
    useState<string>("");
  const editorRef = useRef<LexicalEditor | null>(null);

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

  return (
    <Container>
      <JournalSidebar onSelect={(id) => navigate(`/journals/${id}`)} />

      {selectedJournalId !== undefined && (
        <JournalEditor
          key={selectedJournalId}
          id={selectedJournalId}
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

export default JournalPage;
