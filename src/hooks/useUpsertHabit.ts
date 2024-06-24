import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUser } from "../components/AuthContext.tsx";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName";
import { getSupabaseClient } from "../supabaseClient.ts";

const useUpsertHabit = ({ priorityId }: { priorityId: string }) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { mutateAsync } = useMutation({
    mutationFn: async (habit: Partial<Habit>) => {
      return getSupabaseClient()
        .from(TableName.HABITS)
        .upsert(
          {
            ...habit,
            user_id: user.id,
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
        queryKey: QueryKey.habits.list({ priorityId }),
      });
    },
  });
  return {
    upsertHabit: mutateAsync,
  };
};

export default useUpsertHabit;
