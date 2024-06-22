import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "../supabaseClient.ts";

const useJournalEntry = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["journals-entry", id],
    queryFn: async (): Promise<any> => {
      const { data } = await getSupabaseClient()
        .from("journals")
        .select("*")
        .eq("id", id)
        .single();

      if (data === null) {
        return undefined;
      }

      return data;
    },
    enabled: id !== undefined,
  });
};

export default useJournalEntry;
