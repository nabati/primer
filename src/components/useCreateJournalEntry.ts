import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "../supabaseClient.ts";
import { JournalEntry } from "../types.ts";
import { useUser } from "./AuthContext.tsx";

const useCreateJournalEntry = () => {
  const user = useUser();
  const queryClient = useQueryClient();

  return async (): Promise<string> => {
    const { data: row } = await getSupabaseClient()
      .from("journals")
      .insert([{ content: "", user_id: user.id }])
      .select("*")
      .single<JournalEntry>();

    if (row === null) {
      throw new Error(
        "Something went wrong while creating a new journal entry",
      );
    }
    queryClient.invalidateQueries({ queryKey: ["journals"] });
    return row.id;
  };
};

export default useCreateJournalEntry;
