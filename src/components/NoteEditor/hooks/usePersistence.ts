import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import QueryKey from "../../../constants/QueryKey.ts";
import queryKey from "../../../constants/QueryKey.ts";
import TableName from "../../../constants/TableName.ts";
import useJournalEntry from "../../../hooks/useJournalEntry.ts";
import useJournalUpsert from "../../../hooks/useJournalUpsert.ts";
import { getSupabaseClient } from "../../../supabaseClient.ts";
import { JournalEntry } from "../../../types.ts";

const usePersistence = ({ id }: { id: string }) => {
  const [editorContent, setEditorContent] = useState<string>("");
  const { data: journalEntry, isFetching } = useJournalEntry({ id });

  useEffect(() => {
    if (journalEntry?.content === undefined) {
      return;
    }

    setEditorContent(journalEntry.content);
  }, [journalEntry]);

  const upsertJournal = useJournalUpsert();

  const saveImmediate = useCallback(async () => {
    await upsertJournal({ id, content: editorContent });
  }, [id, upsertJournal, editorContent]);

  const saveDebounced = useMemo(
    () =>
      debounce(
        ({ id, content }: { id: string; content: string }) =>
          upsertJournal({ id, content }),
        500,
        {
          maxWait: 5000,
        },
      ),
    [upsertJournal],
  );

  useEffect(() => {
    saveDebounced({ id, content: editorContent });
  }, [saveDebounced, id, editorContent]);

  const queryClient = useQueryClient();
  const del = async () => {
    saveDebounced.cancel();
    await getSupabaseClient().from(TableName.NOTES).delete().eq("id", id);
    queryClient.setQueryData(
      QueryKey.notes.list(),
      (journalEntries: JournalEntry[]) =>
        journalEntries.filter((journalEntry) => journalEntry.id !== id),
    );
    queryClient.invalidateQueries({ queryKey: QueryKey.notes.list() });
    queryClient.invalidateQueries({ queryKey: QueryKey.notes.single(id) });
  };

  return {
    journalEntry,
    isFetching,
    onEditorContentChange: setEditorContent,
    hasUnsavedChanges: editorContent !== journalEntry?.content,
    save: saveImmediate,
    del,
  };
};

export default usePersistence;
