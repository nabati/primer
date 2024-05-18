import { useQuery } from "@tanstack/react-query";

export const useGptPrompt = ({ prompt }: { prompt: string }) => {
  return useQuery({
    queryKey: ["gpt", prompt],
    queryFn: async () => {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
          model: "llama3",
          prompt,
          stream: false,
          options: {
            temperature: 0,
          },
        }),
      });

      return response.json();
    },
    enabled: prompt.length > 0,
  });
};
