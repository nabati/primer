import { Action } from "../../types.ts";

const getLinkedActionList = (actions: Action[]): Action[] => {
  if (actions.length === 0) {
    return actions;
  }

  return actions.map((action, index) => ({
    ...action,
    head_id: actions[index - 1]?.id,
  }));
};

export default getLinkedActionList;
