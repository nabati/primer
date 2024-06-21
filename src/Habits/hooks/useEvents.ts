import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useUser } from "../../components/AuthContext.tsx";
import { getSupabaseClient } from "../../supabaseClient.ts";

const useEvents = ({
  habitId,
  startDate,
  endDate,
}: {
  habitId: string;
  startDate: Date;
  endDate: Date;
}) => {
  const user = useUser();
  return useQuery({
    queryKey: ["events", habitId, startDate, endDate],
    queryFn: async () => {
      const { data: events } = await getSupabaseClient()
        .from("events")
        .select("*")
        .eq("habit_id", habitId)
        .eq("user_id", user.id)
        .gte("date", format(startDate, "yyyy-MM-dd"))
        .lte("date", format(endDate, "yyyy-MM-dd"));

      return events;
    },
  });
};

export default useEvents;
