import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sortActions } from "../components/Actions/hooks/useSortedActions.ts";

import { useUser } from "../components/AuthContext.tsx";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName";
import { getSupabaseClient } from "../supabaseClient.ts";
import { Action } from "../types.ts";

const useUpsertAction = ({ priorityId }: { priorityId: string }) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { mutateAsync } = useMutation({
    mutationFn: async (
      action: Partial<Action> & {
        id: string;
        head_id: string | undefined | null;
      },
    ) => {
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
    onMutate: (action) => {
      queryClient.cancelQueries({
        queryKey: QueryKey.actions.list({ priorityId }),
      });
      queryClient.setQueryData(
        QueryKey.actions.list({ priorityId }),
        (prevActions: Action[]) => {
          return sortActions([...prevActions, action]);
        },
      );
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
