import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import Markdown from "react-markdown";
import styled from "styled-components";
import { useCoachState } from "./store.ts";
import { useGptPrompt } from "./useGptPrompt.tsx";

type CoachProps = {
  //
};

const Coach: React.FC<CoachProps> = () => {
  const { prompt } = useCoachState();
  const { data: response, isFetching } = useGptPrompt({
    prompt,
  });

  return (
    <Container>
      <h3>Coach AI</h3>

      {isFetching && (
        <Box>
          <CircularProgress />
        </Box>
      )}

      {!isFetching && response?.response !== undefined && (
        <Box>
          <Markdown>{response.response}</Markdown>
        </Box>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  align-self: stretch;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  padding: 8px;
  overflow-y: auto;
`;

export default Coach;
