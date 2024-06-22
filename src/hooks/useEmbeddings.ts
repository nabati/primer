import { useQueries } from "@tanstack/react-query";
import getEmbedding from "../components/getEmbedding.ts";

const useEmbeddings = (chunks: string[]) => {
  return useQueries({
    queries: chunks.map((chunk) => ({
      queryKey: ["embedding", chunk],
      queryFn: () => getEmbedding(chunk),
    })),
    combine: (results) => ({
      data: results.map((result) => result.data ?? []),
      isPending: results.some((result) => result.isPending),
    }),
  });
};

export default useEmbeddings;
