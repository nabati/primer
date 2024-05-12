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
  const { data: response } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
          model: "llama3",
          prompt: `You are my trusted, wise and insightful mentor, emotional support and dream architect. We already know each other - skip the introductions. Help me navigate life's challenges, uncover new perspectives, and achieve my goals. You help me based on the contents of my journal, where you give more weight to the final section of the entry. Answer briefly. This is my last journal entry in Markdown format: \`${content}\``,
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
      {response?.response !== undefined && (
        <Markdown>{response.response}</Markdown>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  border: 1px solid green;
  flex-grow: 1;
  align-self: stretch;
  flex-direction: column;
  max-height: 40em;
  overflow-y: auto;
  width: 100%;
`;

export default Coach;
