import { useQuery } from "@tanstack/react-query";
import getSemanticChunks from "../getSemanticChunks.ts";

const useSemanticChunks = ({
  content,
  threshold,
}: {
  content: string;
  threshold?: number;
}) => {
  return useQuery({
    queryKey: ["semantic-chunks", threshold, content],
    queryFn: () => getSemanticChunks(content, threshold),
  });
};

export default useSemanticChunks;
