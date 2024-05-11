import { useQuery } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";
import { getSupabaseClient } from "./supabaseClient.ts";
import TinderCard from "react-tinder-card";
import { Prompt } from "./types.ts";

type SwipeDirection = "right" | "left" | "up" | "down";

const Stack: React.FC = () => {
  const { data: prompts } = useQuery({
    queryKey: ["cards"],
    queryFn: async (): Promise<Card[]> => {
      const { data: cards } = await getSupabaseClient()
        .from("prompts")
        .select("*")
        .order("last_reviewed", { ascending: true });

      if (cards === null) {
        return [];
      }

      return cards;
    },
    initialData: [],
  });

  const onSwipePrompt = async (prompt: Prompt, direction: SwipeDirection) => {
    if (direction === "left") {
      // Return
      return;
    }

    if (direction === "right") {
      // Archive
      await getSupabaseClient()
        .from("prompts")
        .update({ last_reviewed: new Date(), reviews: prompt.reviews + 1 })
        .eq("id", prompt.id);
    }

    // Whenever a card has been swiped right
  };

  return (
    <Container>
      {prompts?.map((prompt) => (
        <TinderCard
          key={prompt.id}
          onSwipe={(direction: SwipeDirection) =>
            onSwipePrompt(prompt, direction)
          }
          preventSwipe={["up", "down"]}
        >
          <Card>{prompt.content}</Card>
        </TinderCard>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  clear: both;
  height: 300px;
  margin: 48px;
`;

const Card = styled.div`
  width: 300px;
  height: 300px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  border: 1px solid gray;
  border-radius: 8px;
  padding: 24px;
  position: absolute;
  cursor: pointer;
  text-align: center;
  user-select: none;
  clear: both;
  font-family: Roboto, sans-serif;
`;

export default Stack;
