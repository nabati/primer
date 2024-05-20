import { Embeddings, EmbeddingsParams } from "@langchain/core/embeddings";
import { AsyncCaller } from "@langchain/core/utils/async_caller";

export default class OllamaEmbeddings implements Embeddings {
  caller: AsyncCaller;
  constructor(params?: EmbeddingsParams) {
    this.caller = new AsyncCaller(params ?? {});
  }

  embedDocuments(documents: string[]): Promise<number[][]> {
    return Promise.all(
      documents.map(async (document) => {
        const response = await fetch("http://localhost:11434/api/embeddings", {
          method: "POST",
          body: JSON.stringify({
            model: "nomic-embed-text",
            prompt: document,
          }),
        });

        const { embedding } = await response.json();
        return embedding;
      }),
    );
  }

  async embedQuery(document: string): Promise<number[]> {
    const resolved = await this.embedDocuments([document]);
    return resolved[0];
  }
}
