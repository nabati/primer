import { useMemo } from "react";
import { Action } from "../../../types.ts";

const findLinkedChild = (actions: Action[], headId: string): Action[] => {
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

export const sortActions = (actions: Action[]): Action[] => {
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
