const getEmbedding = async (data: string): Promise<number[]> => {
  const response = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: data,
    }),
  });

  const json = await response.json();

  return json.embedding;
};

export default getEmbedding;
