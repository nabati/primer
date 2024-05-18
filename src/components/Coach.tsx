import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Markdown from "react-markdown";
import styled from "styled-components";
import { useCoachState } from "./store.ts";

type CoachProps = {
  //
};

const useCoachQuery = ({ prompt }: { prompt: string }) => {
  return useQuery({
    queryKey: ["coach", prompt],
    queryFn: async () => {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
          model: "llama3",
          prompt,
          stream: false,
        }),
      });

      return response.json();
    },
    enabled: prompt.length > 0,
  });
};

const Coach: React.FC<CoachProps> = () => {
  const { prompt } = useCoachState();
  const { data: response, isFetching } = useCoachQuery({
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
