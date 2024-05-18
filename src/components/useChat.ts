import { useQuery } from "@tanstack/react-query";

export type PrimerMessage = {
  author: "platform" | "coach" | "user";
  content: string;
};

export type GptMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export const mapMessagesToGptMessages = (
  messages: PrimerMessage[],
): GptMessage[] => {
  return messages.map((message) => ({
    role:
      message.author === "platform" || message.author === "user"
        ? "user"
        : "assistant",
    content: message.content,
  }));
};

export const useChat = ({ messages }: { messages: GptMessage[] }) => {
  return useQuery({
    queryKey: ["chat", ...messages],
    queryFn: async () => {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        body: JSON.stringify({
          model: "llama3",
          messages,
          stream: false,
          options: {
            temperature: 0,
          },
        }),
      });

      return response.json();
    },
    enabled: messages.length > 0,
  });
};
