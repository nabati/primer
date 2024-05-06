import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getSupabaseClient } from "./supabaseClient.ts";
import { Card } from "./types.ts";

const List: React.FC = () => {
  const { data: cards } = useQuery({
    queryKey: ["cards"],
    queryFn: async (): Promise<Card[]> => {
      const { data: cards } = await getSupabaseClient()
        .from("cards")
        .select("*");

      if (cards === null) {
        return [];
      }

      return cards;
    },
    initialData: [],
  });

  return <div>{cards?.map((card) => <div>{card.content}</div>)}</div>;
};

export default List;
