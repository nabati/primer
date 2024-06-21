import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback } from "react";
import { useUser } from "../../components/AuthContext.tsx";
import { getSupabaseClient } from "../../supabaseClient.ts";
import type { Event } from "../EntryForm";

const upsertEntry = async (event: Event): Promise<Event> => {
  const { data, error } = await getSupabaseClient()
    .from("events")
    .upsert(event, { onConflict: "date, habit_id" })
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  console.log(data, typeof data.date);

  return data;
};

const useEventUpsert = () => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { mutateAsync } = useMutation({
    mutationFn: upsertEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        exact: false,
      });
    },
  });

  return useCallback(
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
};

export default useEventUpsert;
