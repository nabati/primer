import markdownSplitter from "../markdownSplitter.ts";

const getTextChunks = async (text: string): Promise<string[]> => {
  const splits = markdownSplitter(text);
  return splits;
};

export default getTextChunks;
