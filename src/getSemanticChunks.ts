import cosineSimilarity from "./components/cosineSimilarity.ts";
import generateEmbeddings from "./components/generateEmbeddings.ts";
import markdownSplitter from "./markdownSplitter.ts";

const DEFAULT_MERGING_SIMILARITY_THRESHOLD = 0.5;

const getSemanticChunks = async (
  text: string,
  mergingSimilarity = DEFAULT_MERGING_SIMILARITY_THRESHOLD,
): Promise<string[]> => {
  const chunks = markdownSplitter(text);

  const embeddings = await Promise.all(
    chunks.map((chunk) => generateEmbeddings(chunk)),
  );

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
