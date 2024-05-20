import { TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import styled from "styled-components";
import { useDebounce } from "use-debounce";
import prompts from "./prompts.ts";
import { usePassiveEditorContent } from "./store.ts";
import { mapMessagesToGptMessages, PrimerMessage, useChat } from "./useChat.ts";

type CoachProps = {
  //
};

const Coach: React.FC<CoachProps> = () => {
  const passiveEditorContent = usePassiveEditorContent();
  const [debouncedPassiveEditorContent] = useDebounce(
    passiveEditorContent,
    3000,
  );
  const [pendingMessage, setPendingMessage] = useState<string>("");

  const [messages, setMessages] = useState<PrimerMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        author: "platform",
        content: prompts.default(debouncedPassiveEditorContent),
      },
    ]);
  }, [debouncedPassiveEditorContent]);

  const { data: response, isFetching } = useChat({
    messages: mapMessagesToGptMessages(messages),
  });

  const onSendMessage = () => {
    if (response?.message?.content === undefined) {
      return;
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        author: "coach",
        content: response.message.content,
      },
      {
        author: "user",
        content: pendingMessage,
      },
    ]);
    setPendingMessage("");
  };

  return (
    <Container>
      <h3>Coach AI</h3>

      {isFetching && (
        <Box>
          <CircularProgress />
        </Box>
      )}

      {!isFetching && response?.message !== undefined && (
        <Box>
          <Markdown>{response.message.content}</Markdown>
        </Box>
      )}

      <Box>
        <TextareaAutosize
          minRows={3}
          onChange={(e) => setPendingMessage(e.target.value)}
          value={pendingMessage}
        />
        <Button onClick={onSendMessage} value={pendingMessage}>
          Send
        </Button>
      </Box>
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
