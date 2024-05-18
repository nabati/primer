import { TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import styled from "styled-components";
import { useCoachState, usePassiveEditorContent } from "./store.ts";
import { mapMessagesToGptMessages, PrimerMessage, useChat } from "./useChat.ts";
import { useGptPrompt } from "./useGptPrompt.tsx";

type CoachProps = {
  //
};

/**
 * Modelling this as  a coach component that uses the GPT-3 API to provide
 * responses to prompts.
 *
 * Probably we want the state to be composed of the prompts and the responses.
 * I guess some of the entries in the conversation we want to be visible, whereas some will be hidden
 * For instance, the first prompt that generates a response is likely hidden from the user.
 * If the user writes something themselves, then that is likely visible.
 *
 * From a programmatic point of view, we want to be able to either append items to the conversation
 * or replace items in the conversation entirely.
 *
 */

const Coach: React.FC<CoachProps> = () => {
  const passiveEditorContent = usePassiveEditorContent();
  const [pendingMessage, setPendingMessage] = useState<string>("");

  const [messages, setMessages] = useState<PrimerMessage[]>([]);

  console.log("message", messages);

  useEffect(() => {
    setMessages([
      {
        author: "platform",
        content: passiveEditorContent,
      },
    ]);
  }, [passiveEditorContent]);

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
