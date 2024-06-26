import { useCallback } from "react";

import { Action } from "../types.ts";
import useUpsertActions from "./useUpsertActions.ts";

const useUpsertAction = ({ priorityId }: { priorityId: string }) => {
  const { upsertActions } = useUpsertActions({ priorityId });

  const upsertAction = useCallback(
    async (
      action: Partial<Action> & {
        id: string;
        head_id: string | undefined | null;
      },
    ) => {
      const { data: actions } = await upsertActions([action]);

      if (actions?.length !== 1) {
        throw new Error("Expected exactly one action to be returned");
      }

      return { data: actions[0] };
    },
    [upsertActions],
  );

  return {
    upsertAction,
  };
};

export default useUpsertAction;
