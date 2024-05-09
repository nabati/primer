import React, { useCallback, useEffect } from "react";
import { getSupabaseClient } from "./supabaseClient.ts";
import { useQueryClient } from "@tanstack/react-query";

const Create: React.FC = () => {
  const queryClient = useQueryClient();

  const handleCreate = useCallback(async () => {
    const content = window.prompt("Enter card content");

    if (content === null || content.trim() === "") {
      return;
    }

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
  }, [queryClient]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.shiftKey && event.key === "i") {
        event.stopPropagation();
        event.preventDefault();
        handleCreate();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <button onClick={handleCreate}>Create card</button>;
};

export default Create;
