import cosineSimilarity from "./components/cosineSimilarity.ts";

const DEFAULT_MERGING_SIMILARITY_THRESHOLD = 0.5;

const getSemanticChunks = async (
  chunks: string[],
  embeddings: number[][],
  mergingSimilarity = DEFAULT_MERGING_SIMILARITY_THRESHOLD,
): Promise<string[]> => {

  const similarities = embeddings.map((embedding, index) => {
    if (index === embeddings.length - 1) {
      return 0;
    }

    return cosineSimilarity(embedding, embeddings[index + 1]);
  });

  // If two chunks are similar, merge them
  const mergedChunks = chunks.reduce<string[]>((acc, chunk, index) => {
    if (index === 0) {
      acc.push(chunk);
      return acc;
    }

    if (similarities[index - 1] > mergingSimilarity) {
      const lastMergedChunk = acc[acc.length - 1] ?? "";
      acc[acc.length - 1] = `${lastMergedChunk} ${chunk}`;
      return acc;
    }

    acc.push(chunk);
    return acc;
  }, []);
  return mergedChunks;
};

export default getSemanticChunks;
