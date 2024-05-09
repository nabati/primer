import React, { useCallback } from "react";
import { getSupabaseClient } from "./supabaseClient.ts";
import { useQueryClient } from "@tanstack/react-query";

const Create: React.FC = () => {
  const queryClient = useQueryClient();
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
      .from("prompts")
      .insert({ content, user_id: user.id });

    // Invalidate react-query cache
    queryClient.invalidateQueries({ queryKey: ["cards"] });
  }, []);

  return <button onClick={handleClick}>Create card</button>;
};

export default Create;
