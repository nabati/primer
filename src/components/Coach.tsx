import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Markdown from "react-markdown";
import styled from "styled-components";
import { useDebounce } from "use-debounce";

type CoachProps = {
  content: string;
};

const Coach: React.FC<CoachProps> = ({ content }) => {
  console.log("Coach", content);
  const queryKey = useDebounce(`coach-${content}`, 3000);
  const { data: response, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
          model: "llama3",
          prompt: `You are my trusted, wise and insightful mentor, emotional support and dream architect. Based on my last journal entry, make actionable suggestions on things I could improve: \`${content}\``,
          // prompt: `You are my trusted, wise and insightful mentor, emotional support and dream architect. Based on my last journal entry, highlight useful reflections that I might have missed: \`${content}\``,
          // prompt: `You are my trusted, wise and insightful mentor, emotional support and dream architect. We already know each other - skip the introductions. Help me navigate life's challenges, uncover new perspectives, and achieve my goals. You help me based on the contents of my journal, give ascending priority based on the chronology of the text sections. Answer briefly. This is my last journal entry in Markdown format: \`${content}\``,
          stream: false,
        }),
      });

      return response.json();
    },
    enabled: content.length > 0,
  });

  return (
    <Container>
      <h2>Coach AI</h2>
      <br />

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
  max-height: 40em;
  overflow-y: auto;
  width: 100%;
  padding: 16px;
`;

export default Coach;
