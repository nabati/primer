import { useQueryClient } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";
import { Note } from "../types.ts";
import useUser from "./useUser.ts";
const useCreateNote = () => {
  const user = useUser();
  const queryClient = useQueryClient();

  return async ({
    priorityId,
  }: { priorityId?: string } = {}): Promise<string> => {
    const { data: row } = await getSupabaseClient()
      .from(TableName.NOTES)
      .insert([{ content: "", user_id: user.id, priority_id: priorityId }])
      .select("*")
      .single<Note>();

    if (row === null) {
      throw new Error("Something went wrong while creating a new note");
    }
    queryClient.invalidateQueries({ queryKey: QueryKey.notes.list() });
    return row.id;
  };
};

export default useCreateNote;
