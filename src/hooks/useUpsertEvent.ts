import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback } from "react";
import { getSupabaseClient } from "../supabaseClient.ts";
import type { HabitEvent } from "../types.ts";
import useUser from "./useUser.ts";

const upsertEntry = async (event: HabitEvent): Promise<HabitEvent> => {
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

const useUpsertEvent = () => {
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

export default useUpsertEvent;
