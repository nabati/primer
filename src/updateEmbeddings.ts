// Update embeddings for all notes in the background if the update date is older than the
import getEmbedding from "./components/getEmbedding.ts";
import getTextChunks from "./components/getTextChunks.ts";
// last update for the journal
import { getSupabaseClient } from "./supabaseClient.ts";
import { Note } from "./types.ts";

const updateEmbeddings = async () => {
  const { data: notes } = await getSupabaseClient().rpc(
    "get_notes_with_outdated_chunks",
  );

  await Promise.all(
    notes.map(async (note: Note) => {
      const chunks = await getTextChunks(note.content);

      const embeddings = await Promise.all(
        chunks.map((chunk) => getEmbedding(chunk)),
      );

      await getSupabaseClient().from("chunks").delete().eq("note_id", note.id);

      await getSupabaseClient()
        .from("chunks")
        .upsert(
          embeddings.map((embedding, index) => ({
            note_id: note.id,
            user_id: note.user_id,
            content: chunks[index],
            embedding,
          })),
        );
    }),
  );
};

export default updateEmbeddings;
