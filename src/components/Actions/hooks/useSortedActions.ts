import { useMemo } from "react";
import { Action } from "../../../types.ts";

const findLinkedChild = <T extends X>(actions: T[], headId: string): T[] => {
  const action = actions.find((action) => action.head_id === headId);

  if (action === undefined) {
    return [];
  }

  const linkedChild = findLinkedChild(actions, action.id);

  if (linkedChild === undefined) {
    return [action];
  }

  return [action, ...linkedChild];
};

type X = {
  id: string;
  head_id: string | null | undefined;
};

export const sortActions = <T extends X>(actions: T[]): T[] => {
  const headlessActions = actions.filter(
    (action) => action.head_id === null || action.head_id === undefined,
  );

  return headlessActions.flatMap((action) => [
    action,
    ...findLinkedChild(actions, action.id),
  ]);
};

const useSortedActions = (actions: Action[]): Action[] => {
  return useMemo(() => sortActions(actions), [actions]);
};
export default useSortedActions;
