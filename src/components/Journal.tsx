import CircularProgress from "@mui/material/CircularProgress";
import { useQuery } from "@tanstack/react-query";
import { endOfDay, startOfDay } from "date-fns";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { getSupabaseClient } from "../supabaseClient.ts";
import { useUser } from "./AuthContext.tsx";
import Editor from "./Editor";
import throttle from "lodash/throttle";
import { v4 as uuidv4 } from "uuid";

type JournalProps = {
  //
};

type JournalEntry = {
  id: string;
  content: string;
};

const Journal: React.FC<JournalProps> = () => {
  const editorContent = useRef<string>("");
  const lastSavedEditorContent = useRef<string>("");
  const user = useUser();

  // Get today's journal entry, if it exists.
  const { data: initialJournalEntry, isFetching } = useQuery({
    queryKey: ["journals"],
    queryFn: async (): Promise<JournalEntry | null> => {
      const { data: entries } = await getSupabaseClient()
        .from("journals")
        .select("*")
        .gte("created_at", startOfDay(new Date()).toISOString())
        .lte("created_at", endOfDay(new Date()).toISOString());

      if (entries === null) {
        return null;
      }

      if (entries.length === 0) {
        return null;
      }

      const entry = entries[0];
      editorContent.current = entry.content;
      lastSavedEditorContent.current = entry.content;
      return entries[0];
    },
    initialData: null,
  });

  const entryUuid = useMemo(() => {
    return initialJournalEntry?.id ?? uuidv4();
  }, [initialJournalEntry]);

  const save = useCallback(async () => {
    await getSupabaseClient().from("journals").upsert({
      id: entryUuid,
      content: editorContent.current,
      user_id: user.id,
    });
    lastSavedEditorContent.current = editorContent.current;
  }, [entryUuid, user]);

  const throttledSave = useMemo(
    () =>
      throttle(() => {
        save();
      }, 5000),
    [save],
  );

  const handleChange = useCallback(
    (content: string) => {
      editorContent.current = content;
      throttledSave();
    },
    [throttledSave],
  );

  useEffect(() => {
    const handleBeforeUnload = (event: Event) => {
      if (editorContent.current === lastSavedEditorContent.current) {
        return;
      }

      event.preventDefault();
      save();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [save]);

  if (isFetching) {
    return <CircularProgress />;
  }

  return (
    <div>
      <Editor
        onChange={handleChange}
        initialValue={initialJournalEntry?.content}
      />
    </div>
  );
};

export default Journal;
