import { useQuery } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

const useHabits = ({ priorityId }: { priorityId: string }) => {
  return useQuery({
    queryKey: QueryKey.habits.list({ priorityId }),
    queryFn: async () => {
      console.log("@@useQueryFn", priorityId);
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

export default useHabits;
