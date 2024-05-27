import { TextareaAutosize } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import styled from "styled-components";
import { useDebounce } from "use-debounce";
import prompts from "./prompts.ts";
import { useActivity } from "./store.ts";
import { PrimerMessage, useChat } from "./useChat.ts";
import useRelatedContext from "./useRelatedContext.ts";

type CoachProps = {
  journalId: string | undefined;
};

const Coach: React.FC<CoachProps> = ({ journalId }) => {
  const activity = useActivity();
  const [debouncedActivity, { flush }] = useDebounce(activity, 3000);
  const [pendingMessage, setPendingMessage] = useState<string>("");

  const [messages, setMessages] = useState<PrimerMessage[]>([]);

  const { context, isFetching: isFetchingContext } = useRelatedContext({
    activity: debouncedActivity,
    journalId: journalId ?? "",
  });

  useEffect(() => {
    if (isFetchingContext) {
      return;
    }

    setMessages([
      {
        author: "platform",
        content: prompts.defaultWithContext(activity.content, context ?? []),
      },
    ]);
  }, [debouncedActivity, context, isFetchingContext]);

  useEffect(() => {
    if (activity.type === "drill") {
      flush();
    }
  }, [activity]);

  const { data: response, isFetching } = useChat({
    messages,
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

  const isFetchingComposite = isFetching || isFetchingContext;

  return (
    <Container>
      <h3>Coach AI</h3>

      {isFetchingComposite && (
        <Box>
          <CircularProgress />
        </Box>
      )}

      {!isFetchingComposite && response?.message !== undefined && (
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
