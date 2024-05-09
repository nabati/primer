import { useQuery } from "@tanstack/react-query";
import React from "react";
import styled from "styled-components";
import { getSupabaseClient } from "./supabaseClient.ts";
import TinderCard from "react-tinder-card";

const Stack: React.FC = () => {
  const { data: cards } = useQuery({
    queryKey: ["cards"],
    queryFn: async (): Promise<Card[]> => {
      const { data: cards } = await getSupabaseClient()
        .from("prompts")
        .select("*");

      if (cards === null) {
        return [];
      }

      return cards;
    },
    initialData: [],
  });

  const onSwipe = (direction: unknown) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (myIdentifier: unknown) => {
    console.log(myIdentifier + " left the screen");
  };

  return (
    <Container>
      {cards?.map((card) => (
        <TinderCard
          key={card.id}
          onSwipe={onSwipe}
          onCardLeftScreen={() => onCardLeftScreen("fooBar")}
          preventSwipe={["right", "left"]}
        >
          <Card>{card.content}</Card>
        </TinderCard>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
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
  position: absolute;
`;

export default Stack;
