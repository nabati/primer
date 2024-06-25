import { useQuery } from "@tanstack/react-query";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";
import QueryKey from "../constants/QueryKey";
import { Action } from "../types.ts";
import { sortActions } from "../components/Actions/hooks/useSortedActions.ts";

const useListActions = ({ priorityId }: { priorityId?: string } = {}) => {
  return useQuery({
    queryKey: QueryKey.actions.list({ priorityId }),
    queryFn: async (): Promise<Action[]> => {
      let query = getSupabaseClient()
        .from(TableName.ACTIONS)
        .select("*")
        .is("completed_at", null)
        .order("created_at", { ascending: false });

      if (priorityId !== undefined) {
        query = query.eq("priority_id", priorityId);
      }

      if (priorityId === undefined) {
        query = query.is("priority_id", null);
      }

      const { data: entries } = await query;

      return sortActions(entries as Action[]);
    },
  });
};

export default useListActions;
