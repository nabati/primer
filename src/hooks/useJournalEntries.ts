import { useQuery } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

const useJournalEntries = () => {
  const { data: entries = [], isFetching } = useQuery({
    queryKey: QueryKey.journals.list(),
    queryFn: async (): Promise<any> => {
      const { data: entries } = await getSupabaseClient()
        .from(TableName.JOURNALS)
        .select("*")
        .order("created_at", { ascending: false });
      return entries;
    },
  });

  return {
    entries,
    isFetching,
  };
};

export default useJournalEntries;
