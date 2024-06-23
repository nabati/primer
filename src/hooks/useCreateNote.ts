import { useQueryClient } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";
import { Note } from "../types.ts";
import { useUser } from "../components/AuthContext.tsx";

const useCreateNote = () => {
  const user = useUser();
  const queryClient = useQueryClient();

  return async ({
    priorityId,
  }: { priorityId?: string } = {}): Promise<string> => {
    const { data: row } = await getSupabaseClient()
      .from(TableName.NOTES)
      .insert([{ content: "", user_id: user.id, priorityId }])
      .select("*")
      .single<Note>();

    if (row === null) {
      throw new Error(
        "Something went wrong while creating a new journal entry",
      );
    }
    queryClient.invalidateQueries({ queryKey: QueryKey.notes.list() });
    return row.id;
  };
};

export default useCreateNote;
