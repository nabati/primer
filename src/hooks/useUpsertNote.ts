import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../components/AuthContext.tsx";
import QueryKey from "../constants/QueryKey.ts";
import TableName from "../constants/TableName.ts";
import { getSupabaseClient } from "../supabaseClient.ts";
import { Note } from "../types.ts";

const useUpsertNote = () => {
  const user = useUser();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({
      id,
      content,
      priorityId,
    }: {
      id: string;
      content: string;
      priorityId?: string;
    }) => {
      return getSupabaseClient()
        .from(TableName.NOTES)
        .upsert({
          id,
          content: content,
          user_id: user.id,
          priority_id: priorityId,
        })
        .select("*")
        .single();
    },
    onSuccess: ({ data: note }) => {
      queryClient.setQueryData(
        QueryKey.notes.list({
          priorityId: note.priority_id,
        }),
        (oldNotes: Note[]) => {
          return [
            note,
            ...oldNotes.filter((oldNote) => oldNote.id !== note.id),
          ];
        },
      );
      queryClient.setQueryData(QueryKey.notes.single(note.id), note);
    },
    onError: (_, { id, priorityId }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKey.notes.list({ priorityId }),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKey.notes.single(id),
      });
    },
  });

  return mutateAsync;
};

export default useUpsertNote;
