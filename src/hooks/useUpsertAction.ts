import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUser } from "../components/AuthContext.tsx";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName";
import { getSupabaseClient } from "../supabaseClient.ts";

const useUpsertAction = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { mutateAsync } = useMutation({
    mutationFn: async ({
      content,
      priorityId,
    }: {
      content: string;
      priorityId: string;
    }) => {
      return getSupabaseClient()
        .from(TableName.ACTIONS)
        .upsert(
          {
            content: content,
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
    onSuccess: (_, { priorityId }) => {
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
