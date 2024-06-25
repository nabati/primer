import { Action } from "../../types.ts";

const isValidActionList = (actions: Action[]): boolean => {
  if (actions.length === 0) {
    return true;
  }

  if (actions[0].head_id !== null && actions[0].head_id !== undefined) {
    console.debug("First action has a head_id", actions[0]);
    return false;
  }

  return actions.every((action, index) => {
    if (index === 0) {
      return true;
    }

    if (actions[index - 1].id !== action.head_id) {
      console.debug(
        "Action is not linked to previous action",
        action,
        actions[index - 1],
      );
      return false;
    }

    return true;
  });
};

export default isValidActionList;
