import { useMutation } from "@tanstack/react-query";
import { useUser } from "../components/AuthContext.tsx";
import { getSupabaseClient } from "../supabaseClient.ts";

const useJournalUpsert = () => {
  const user = useUser();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      await getSupabaseClient().from("journals").upsert({
        id,
        content: content,
        user_id: user.id,
      });
    },
  });

  return mutateAsync;
};

export default useJournalUpsert;
