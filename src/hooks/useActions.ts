import { useQuery } from "@tanstack/react-query";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";
import QueryKey from "../constants/QueryKey";

const useActions = ({ priorityId }: { priorityId?: string } = {}) => {
  return useQuery({
    queryKey: QueryKey.actions.list({ priorityId }),
    queryFn: async () => {
      let query = getSupabaseClient()
        .from(TableName.ACTIONS)
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
};

export default useActions;
