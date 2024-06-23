import { useMutation } from "@tanstack/react-query";

import { useUser } from "../components/AuthContext.tsx";
import TableName from "../constants/TableName";
import { getSupabaseClient } from "../supabaseClient.ts";

const useCreateAction = () => {
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
        .upsert({
          content: content,
          user_id: user.id,
          priority_id: priorityId,
        })
        .select("*")
        .single();
    },
  });
  return {
    createAction: mutateAsync,
  };
};

export default useCreateAction;
