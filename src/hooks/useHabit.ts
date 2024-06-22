import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "../supabaseClient.ts";

const useHabit = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["habit", id],
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
