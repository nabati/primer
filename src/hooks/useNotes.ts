import { useQuery } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

const useNotes = ({ priorityId }: { priorityId?: string } = {}) => {
  const { data: entries = [], isFetching } = useQuery({
    queryKey: QueryKey.notes.list(),
    queryFn: async (): Promise<any> => {
      const { data: entries } = await getSupabaseClient()
        .from(TableName.NOTES)
        .select("*")
        .eq("priority_id", priorityId)
        .order("created_at", { ascending: false });
      return entries;
    },
  });

  return {
    entries,
    isFetching,
  };
};

export default useNotes;
