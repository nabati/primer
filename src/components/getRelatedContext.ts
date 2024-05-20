import { getSupabaseClient } from "../supabaseClient.ts";
import generateEmbeddings from "./generateEmbeddings.ts";

const getRelatedContext = async (query: string): Promise<string[]> => {
  if (query === "") {
    return [];
  }

  const embedding = await generateEmbeddings(query);

  const { data } = await getSupabaseClient().rpc("match_chunks", {
    query_embedding: embedding, // Pass the embedding you want to compare
    match_threshold: 0.5, // Choose an appropriate threshold for your data
    match_count: 5, // Choose the number of matches
  });

  if (data === null) {
    return [];
  }

  console.log("data", data);

  return data.map((d) => d.content);
};

export default getRelatedContext;
