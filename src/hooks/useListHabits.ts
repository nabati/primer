import { useQuery } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

const useListHabits = ({ priorityId }: { priorityId: string }) => {
  return useQuery({
    queryKey: QueryKey.habits.list({ priorityId }),
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from("habits")
        .select("*")
        .eq("priority_id", priorityId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export default useListHabits;
