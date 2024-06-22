// Update embeddings for all journals in the background if the update date is older than the
import getEmbedding from "./components/getEmbedding.ts";
import getTextChunks from "./components/getTextChunks.ts";
// last update for the journal
import { getSupabaseClient } from "./supabaseClient.ts";
import { Note } from "./types.ts";

const updateEmbeddings = async () => {
  const { data: journals } = await getSupabaseClient().rpc(
    "get_journals_with_outdated_chunks",
  );

  await Promise.all(
    journals.map(async (journal: Note) => {
      const chunks = await getTextChunks(journal.content);

      const embeddings = await Promise.all(
        chunks.map((chunk) => getEmbedding(chunk)),
      );

      await getSupabaseClient()
        .from("chunks")
        .delete()
        .eq("journal_id", journal.id);

      await getSupabaseClient()
        .from("chunks")
        .upsert(
          embeddings.map((embedding, index) => ({
            journal_id: journal.id,
            user_id: journal.user_id,
            content: chunks[index],
            embedding,
          })),
        );
    }),
  );
};

export default updateEmbeddings;
