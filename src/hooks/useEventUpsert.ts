import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback } from "react";
import { useUser } from "../components/AuthContext.tsx";
import { getSupabaseClient } from "../supabaseClient.ts";
import type { Event } from "../types.ts";

const upsertEntry = async (event: Event): Promise<Event> => {
  const { data, error } = await getSupabaseClient()
    .from("events")
    .upsert(event, { onConflict: "date, habit_id" })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const useEventUpsert = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { mutateAsync, variables } = useMutation({
    mutationFn: upsertEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        exact: false,
      });
    },
  });

  const upsert = useCallback(
    async ({
      date,
      value,
      habitId,
    }: {
      date: Date;
      value: number;
      habitId: string;
    }) =>
      mutateAsync({
        date: format(date, "yyyy-MM-dd"),
        value: value,
        habit_id: habitId,
        user_id: user.id,
      }),
    [mutateAsync, user.id],
  );

  return { upsert, variables };
};

export default useEventUpsert;
