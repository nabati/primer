import { useQuery } from "@tanstack/react-query";
import QueryKey from "../constants/QueryKey.ts";
import { getSupabaseClient } from "../supabaseClient.ts";

const useHabit = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: QueryKey.habits.single({ id }),
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from("habits")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export default useHabit;
