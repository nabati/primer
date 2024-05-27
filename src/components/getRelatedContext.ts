import { getSupabaseClient } from "../supabaseClient.ts";
import generateEmbeddings from "./generateEmbeddings.ts";
import { ContextEntry } from "./useRelatedContext.ts";

const getRelatedContext = async (
  query: string,
  excludedJournalId: string | undefined,
): Promise<ContextEntry[]> => {
  if (query === "") {
    return [];
  }

  const embedding = await generateEmbeddings(query);
  const { data } = await getSupabaseClient().rpc("match_chunks", {
    query_embedding: embedding, // Pass the embedding you want to compare
    match_threshold: 0.6, // Choose an appropriate threshold for your data
    match_count: 5, // Choose the number of matches
    excluded_journal_id: excludedJournalId, // Exclude a specific journal ID
  });

  if (data === null) {
    return [];
  }

  console.debug("@@related context", data);
  return data;
};

export default getRelatedContext;
