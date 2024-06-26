import { useQuery } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";
import { Note } from "../types.ts";

const useListNotes = ({ priorityId }: { priorityId?: string } = {}) => {
  const { data: entries = [], isFetching } = useQuery({
    queryKey: QueryKey.notes.list({ priorityId }),
    queryFn: async (): Promise<Note[]> => {
      let query = getSupabaseClient()
        .from(TableName.NOTES)
        .select("*")
        .order("created_at", { ascending: false });

      if (priorityId !== undefined) {
        query = query.eq("priority_id", priorityId);
      }

      if (priorityId === undefined) {
        query = query.is("priority_id", null);
      }

      const { data: entries } = await query;

      if (entries === null) {
        return [];
      }

      return entries;
    },
  });

  return {
    entries,
    isFetching,
  };
};

export default useListNotes;
