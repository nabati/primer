import React, { useCallback } from "react";
import { getSupabaseClient } from "./supabaseClient.ts";

const Create: React.FC = () => {
  const handleClick = useCallback(async () => {
    const content = window.prompt("Enter card content");

    const {
      data: { user },
    } = await getSupabaseClient().auth.getUser();

    if (user === null) {
      console.warn("User is not logged in");
      return;
    }

    await getSupabaseClient()
      .from("cards")
      .insert({ content, user_id: user.id });
  }, []);

  return <button onClick={handleClick}>Create card</button>;
};

export default Create;
