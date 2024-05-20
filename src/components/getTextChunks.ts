import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
const getTextChunks = async (text: string): Promise<string[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 700,
    chunkOverlap: 200,
  });

  const documents = await splitter.createDocuments([text]);
  return documents.map((d) => d.pageContent);
};

export default getTextChunks;
