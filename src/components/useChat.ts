import { useQuery } from "@tanstack/react-query";

type Message = {
  author: "platform" | "coach" | "user";
  content: string;
};

export const useChat = ({ messages }: { messages: Message[] }) => {
  return useQuery({
    queryKey: ["chat", ...messages],
    queryFn: async () => {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        body: JSON.stringify({
          model: "llama3",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
            ...messages.map((message) => ({
              role:
                message.author === "platform" || message.author === "user"
                  ? "user"
                  : "assistant",
              content: message.content,
            })),
          ],
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
