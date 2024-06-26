import { useQuery } from "@tanstack/react-query";
import { endOfDay, format, startOfDay } from "date-fns";
import { useMemo } from "react";
import { getSupabaseClient } from "../supabaseClient.ts";
import { HabitEvent } from "../types.ts";
import formatDateToIsoDate from "../utils/formatDateToIsoDate.ts";
import useUser from "./useUser.ts";

const useListEvents = ({
  habitId,
  startDate,
  endDate,
}: {
  habitId: string;
  startDate: Date | string;
  endDate: Date | string;
}) => {
  const user = useUser();

  const alignedStartDate = useMemo(
    () => formatDateToIsoDate(startOfDay(startDate)),
    [startDate],
  );

  const alignedEndDate = useMemo(
    () => formatDateToIsoDate(endOfDay(endDate)),
    [endDate],
  );

  return useQuery({
    queryKey: ["events", habitId, alignedStartDate, alignedEndDate],
    queryFn: async (): Promise<HabitEvent[]> => {
      const { data: events } = await getSupabaseClient()
        .from("events")
        .select("*")
        .eq("habit_id", habitId)
        .eq("user_id", user.id)
        .gte("date", format(alignedStartDate, "yyyy-MM-dd"))
        .lte("date", format(alignedEndDate, "yyyy-MM-dd"));

      if (events === null) {
        return [];
      }

      return events;
    },
  });
};

export default useListEvents;
