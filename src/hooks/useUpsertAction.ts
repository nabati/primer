import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUser } from "../components/AuthContext.tsx";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName";
import { getSupabaseClient } from "../supabaseClient.ts";
import { Action } from "../types.ts";

const useUpsertAction = ({ priorityId }: { priorityId: string }) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { mutateAsync } = useMutation({
    mutationFn: async (action: Partial<Action>) => {
      return getSupabaseClient()
        .from(TableName.ACTIONS)
        .upsert(
          {
            ...action,
            user_id: user.id,
            priority_id: priorityId,
          },
          {
            onConflict: "id",
          },
        )
        .select("*")
        .single();
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({
        queryKey: QueryKey.actions.list({ priorityId }),
      });
    },
  });
  return {
    upsertAction: mutateAsync,
  };
};

export default useUpsertAction;
