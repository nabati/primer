import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import QueryKey from "../../../constants/QueryKey.ts";
import TableName from "../../../constants/TableName.ts";
import useNote from "../../../hooks/useNote.ts";
import useNoteUpsert from "../../../hooks/useNoteUpsert.ts";
import { getSupabaseClient } from "../../../supabaseClient.ts";
import { Note } from "../../../types.ts";

const usePersistence = ({ id }: { id: string }) => {
  const [editorContent, setEditorContent] = useState<string>("");
  const { data: note, isFetching } = useNote({ id });

  useEffect(() => {
    if (note?.content === undefined) {
      return;
    }

    setEditorContent(note.content);
  }, [note]);

  const upserNote = useNoteUpsert();

  const saveImmediate = useCallback(async () => {
    await upserNote({ id, content: editorContent });
  }, [id, upserNote, editorContent]);

  const saveDebounced = useMemo(
    () =>
      debounce(
        ({ id, content }: { id: string; content: string }) =>
          upserNote({ id, content }),
        500,
        {
          maxWait: 5000,
        },
      ),
    [upserNote],
  );

  useEffect(() => {
    saveDebounced({ id, content: editorContent });
  }, [saveDebounced, id, editorContent]);

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
