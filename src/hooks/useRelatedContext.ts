import { useQueries } from "@tanstack/react-query";
import { sortBy, take } from "lodash";
import getRelatedContextByEmbedding from "../components/getRelatedContextByEmbedding.ts";
import { Activity } from "../components/store.ts";
import useEmbeddings from "./useEmbeddings.ts";
import useSemanticChunks from "./useSemanticChunks.ts";

export type ContextEntry = {
  content: string[];
  note_created_at: string;
  note_updated_at: string;
  similarity: number;
};

const useRelatedContext = ({
  activity,
  noteId,
}: {
  activity: Activity;
  noteId: string;
}) => {
  const { data: chunks, isFetching: isFetchingChunks } = useSemanticChunks({
    content: activity.content,
    threshold: 0.5,
  });

  const { data: embeddings, isPending: isEmbeddingsPending } = useEmbeddings(
    chunks ?? [],
  );

  const { data, isPending } = useQueries({
    queries: embeddings.map((embedding) => ({
      queryKey: ["related-context", embedding],
      queryFn: () => getRelatedContextByEmbedding(embedding, noteId),
      enabled:
        !isFetchingChunks && chunks !== undefined && !isEmbeddingsPending,
    })),
    combine: (results) => ({
      data: results.map((result) => result.data ?? []),
      isPending: results.some((result) => result.isPending),
    }),
  });

  const context = isPending
    ? []
    : take(
        sortBy(data.flat(), (contextEntry) => -contextEntry.similarity),
        5,
      );

  return {
    context,
    isFetching: !isFetchingChunks && !isEmbeddingsPending && !isPending,
  };
};

export default useRelatedContext;
