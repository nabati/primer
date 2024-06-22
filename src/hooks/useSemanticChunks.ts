import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import getSemanticChunks from "../getSemanticChunks.ts";
import markdownSplitter from "../markdownSplitter.ts";
import useEmbeddings from "./useEmbeddings.ts";

const useSemanticChunks = ({
  content,
  threshold,
}: {
  content: string;
  threshold?: number;
}) => {
  const structuralChunks = useMemo(() => {
    return markdownSplitter(content);
  }, [content]);

  const { data: embeddings, isPending } = useEmbeddings(structuralChunks);

  return useQuery({
    queryKey: ["semantic-chunks", threshold, structuralChunks, ...embeddings],
    queryFn: () => getSemanticChunks(structuralChunks, embeddings, threshold),
    enabled: !isPending,
  });
};

export default useSemanticChunks;
