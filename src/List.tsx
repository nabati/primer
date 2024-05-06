import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getSupabaseClient } from "./supabaseClient.ts";

const List: React.FC = () => {
  const { cards } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const {
        data: cards,
        error,
        status,
      } = await getSupabaseClient().from("cards").select("*");
      return { cards, error, status };
    },
  });

  return <div>{cards?.map((card) => <div>{card.content}</div>)}</div>;
};

export default List;
