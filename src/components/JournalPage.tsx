import { LexicalEditor } from "lexical";
import React, { useCallback, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import updateEmbeddings from "../updateEmbeddings.ts";
import Coach from "./Coach.tsx";
import JournalEditor from "./JournalEditor.tsx";
import JournalSidebar from "./JournalSidebar.tsx";
import { setPassiveEditorContent } from "./store.ts";
import useCreateJournalEntry from "./useCreateJournalEntry.ts";
import useJournalEntries from "./useJournalEntries.ts";

type JournalProps = {
  //
};

const JournalPage: React.FC<JournalProps> = () => {
  const navigate = useNavigate();
  const { id: selectedJournalId } = useParams();
  const editorRef = useRef<LexicalEditor | null>(null);
  const createJournalEntry = useCreateJournalEntry();

  const { entries, isFetching } = useJournalEntries();

  useEffect(() => {
    updateEmbeddings();
  }, []);

  useEffect(() => {
    if (selectedJournalId === undefined && entries.length > 0) {
      navigate(`/journals/${entries[0].id}`);
    }
  }, [entries, navigate, selectedJournalId]);

  const handleSelect = useCallback(
    (id: string) => navigate(`/journals/${id}`),
    [navigate],
  );

  const handleCreateClick = async () => {
    const id = await createJournalEntry();
    handleSelect(id);
  };

  return (
    <Container>
      <JournalSidebar
        onCreateClick={handleCreateClick}
        isLoading={isFetching}
        entries={entries}
        onSelect={handleSelect}
      />

      {selectedJournalId !== undefined && (
        <JournalEditor
          key={selectedJournalId}
          id={selectedJournalId}
          onChange={setPassiveEditorContent}
          editorRef={editorRef}
        />
      )}
      <Sidebar>
        <Coach journalId={selectedJournalId} />
        {/*<AdditionalAi />*/}
      </Sidebar>
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 2fr;
  grid-template-rows: 1fr;
  height: calc(100vh - 128px);
  overflow: hidden;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: center;
  height: 100%;
  overflow: hidden;
`;

export default JournalPage;
