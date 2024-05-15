import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "../supabaseClient.ts";

const useJournalEntries = () => {
  const { data: entries = [], isFetching } = useQuery({
    queryKey: ["journals"],
    queryFn: async (): Promise<any> => {
      const { data: entries } = await getSupabaseClient()
        .from("journals")
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
