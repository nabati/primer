import { useQuery } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

const useNotes = ({ priorityId }: { priorityId?: string } = {}) => {
  const { data: entries = [], isFetching } = useQuery({
    queryKey: QueryKey.notes.list(),
    queryFn: async (): Promise<any> => {
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

      return entries;
    },
  });

  return {
    entries,
    isFetching,
  };
};

export default useNotes;
