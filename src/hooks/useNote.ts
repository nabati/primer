import { useQuery } from "@tanstack/react-query";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

const useNote = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["journals-entry", id],
    queryFn: async (): Promise<any> => {
      const { data } = await getSupabaseClient()
        .from(TableName.NOTES)
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

export default useNote;
