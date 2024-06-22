import { useQueryClient } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";
import { JournalEntry } from "../types.ts";
import { useUser } from "./AuthContext.tsx";

const useCreateJournalEntry = () => {
  const user = useUser();
  const queryClient = useQueryClient();

  return async (): Promise<string> => {
    const { data: row } = await getSupabaseClient()
      .from(TableName.JOURNALS)
      .insert([{ content: "", user_id: user.id }])
      .select("*")
      .single<JournalEntry>();

    if (row === null) {
      throw new Error(
        "Something went wrong while creating a new journal entry",
      );
    }
    queryClient.invalidateQueries({ queryKey: QueryKey.journals.list() });
    return row.id;
  };
};

export default useCreateJournalEntry;
