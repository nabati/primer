import { getSupabaseClient } from "../supabaseClient.ts";
import getEmbedding from "./getEmbedding.ts";
import { ContextEntry } from "../hooks/useRelatedContext.ts";

const getRelatedContext = async (
  query: string,
  excludedNoteId: string | undefined,
): Promise<ContextEntry[]> => {
  if (query === "") {
    return [];
  }

  const embedding = await getEmbedding(query);
  const { data } = await getSupabaseClient().rpc("match_chunks", {
    query_embedding: embedding, // Pass the embedding you want to compare
    match_threshold: 0.6, // Choose an appropriate threshold for your data
    match_count: 5, // Choose the number of matches
    excluded_note_id: excludedNoteId, // Exclude a specific note ID
  });

  if (data === null) {
    return [];
  }

  console.debug("@@related context", data);
  return data;
};

export default getRelatedContext;
