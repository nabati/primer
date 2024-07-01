import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sortActions } from "../components/Actions/hooks/useSortedActions.ts";

import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName";
import { getSupabaseClient } from "../supabaseClient.ts";
import { Action } from "../types.ts";
import useUser from "./useUser.ts";

const useUpsertAction = ({ priorityId }: { priorityId: string }) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { mutateAsync } = useMutation({
    mutationFn: async (actions: Partial<Action>[]) =>
      getSupabaseClient()
        .from(TableName.ACTIONS)
        .upsert(
          actions.map((action) => ({
            ...action,
            user_id: user.id,
            priority_id: priorityId,
          })),
          {
            onConflict: "id",
            defaultToNull: false,
          },
        )
        .select("*"),
    onMutate: async (actions) => {
      queryClient.cancelQueries({
        queryKey: QueryKey.actions.list({ priorityId }),
      });
      queryClient.setQueryData(
        QueryKey.actions.list({ priorityId }),
        (prevActions: Action[]) =>
          sortActions([
            // Update existing actions
            ...(prevActions ?? [])
              .map((prevAction) => {
                const matchingUpdatedAction = actions.find(
                  (action) => action.id === prevAction.id,
                );

                if (matchingUpdatedAction) {
                  return {
                    ...prevAction,
                    ...matchingUpdatedAction,
                  };
                }

                return prevAction;
              })
              .filter(
                (action) =>
                  action.completed_at === null ||
                  action.completed_at === undefined,
              ),
            // Include new actions
            ...(actions as Action[]).filter(
              (action) =>
                prevActions.find(
                  (prevAction) => prevAction.id === action.id,
                ) === undefined,
            ),
          ]),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKey.actions.list({ priorityId }),
      });
    },
  });
  return {
    upsertActions: mutateAsync,
  };
};

export default useUpsertAction;
