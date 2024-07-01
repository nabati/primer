import { useQuery } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";
import { Note } from "../types.ts";

const useNote = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: QueryKey.notes.single(id),
    queryFn: async (): Promise<Note | undefined> => {
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
