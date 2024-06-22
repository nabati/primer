import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../components/AuthContext.tsx";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

const useJournalUpsert = () => {
  const user = useUser();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      return getSupabaseClient()
        .from(TableName.JOURNALS)
        .upsert({
          id,
          content: content,
          user_id: user.id,
        })
        .select("*")
        .single();
    },
    onSuccess: ({ data: journalEntry }) => {
      queryClient.setQueryData(
        ["journals-entry", journalEntry.id],
        journalEntry,
      );
    },
  });

  return mutateAsync;
};

export default useJournalUpsert;
