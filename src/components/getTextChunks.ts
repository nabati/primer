import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
const getTextChunks = async (text: string): Promise<string[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 150,
  });

  const documents = await splitter.createDocuments([text]);
  return documents.map((d) => d.pageContent);
};

export default getTextChunks;
