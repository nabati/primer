import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import QueryKey from "../../../constants/QueryKey.ts";
import TableName from "../../../constants/TableName.ts";
import useNote from "../../../hooks/useNote.ts";
import useUpsertNote from "../../../hooks/useUpsertNote.ts";
import { getSupabaseClient } from "../../../supabaseClient.ts";
import { Note } from "../../../types.ts";

const usePersistence = ({
  id,
  priorityId,
}: {
  id: string;
  priorityId?: string;
}) => {
  const [editorContent, setEditorContent] = useState<string>("");
  const { data: note, isFetching } = useNote({ id });

  useEffect(() => {
    if (note?.content === undefined) {
      return;
    }

    setEditorContent(note.content);
  }, [note]);

  const upsertNote = useUpsertNote();

  const saveImmediate = useCallback(async () => {
    await upsertNote({ id, content: editorContent });
  }, [id, upsertNote, editorContent]);

  const saveDebounced = useMemo(
    () =>
      debounce(
        ({ content }: { content: string }) =>
          upsertNote({ id, content, priorityId }),
        3000,
        {
          maxWait: 10000,
        },
      ),
    [upsertNote, id, priorityId],
  );

  useEffect(() => {
    saveDebounced({ content: editorContent });
  }, [saveDebounced, editorContent]);

  const queryClient = useQueryClient();
  const del = async () => {
    saveDebounced.cancel();
    await getSupabaseClient().from(TableName.NOTES).delete().eq("id", id);
    queryClient.setQueryData(QueryKey.notes.list(), (notes: Note[]) =>
      notes.filter((note) => note.id !== id),
    );
    queryClient.invalidateQueries({ queryKey: QueryKey.notes.list() });
    queryClient.invalidateQueries({ queryKey: QueryKey.notes.single(id) });
  };

  return {
    note: note,
    isFetching,
    onEditorContentChange: setEditorContent,
    hasUnsavedChanges: editorContent !== note?.content,
    save: saveImmediate,
    del,
  };
};

export default usePersistence;
