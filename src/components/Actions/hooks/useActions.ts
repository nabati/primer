import { useEffect } from "react";
import useListActions from "../../../hooks/useListActions.ts";
import useUpsertActions from "../../../hooks/useUpsertActions.ts";
import getLinkedActionList from "../getLinkedActionList.ts";
import isValidActionList from "../isValidActionList.ts";
import useSortedActions from "./useSortedActions.ts";

const useActions = ({ priorityId }: { priorityId: string }) => {
  const { upsertActions } = useUpsertActions({ priorityId });
  const { data: remoteActions } = useListActions({ priorityId });

  const actions = useSortedActions(remoteActions ?? []);

  useEffect(() => {
    if (remoteActions === undefined) {
      return;
    }

    if (!isValidActionList(remoteActions)) {
      // This should really only be run if there have been previous issues
      upsertActions(getLinkedActionList(remoteActions));
    }
  }, [remoteActions, upsertActions]);

  return {
    actions,
    upsertActions,
  };
};

export default useActions;
