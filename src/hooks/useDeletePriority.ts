import { useMutation, useQueryClient } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";

import { getSupabaseClient } from "../supabaseClient.ts";
const useDeletePriority = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await getSupabaseClient().from("priorities").delete().eq("id", id);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKey.priorities.list(),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKey.priorities.single(id),
      });
    },
  });

  return { deletePriority: mutateAsync };
};

export default useDeletePriority;
