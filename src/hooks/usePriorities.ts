import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "../supabaseClient.ts";

const usePriorities = () => {
  return useQuery({
    queryKey: ["priorities"],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.from("priorities").select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export default usePriorities;
