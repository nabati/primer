// Keep separate lists between local and remote, and keep track of when something is being edited

import { isEqual } from "lodash";

type StringableId = { id: string };

class LinkedActionList<T extends StringableId> {
  private actions: T[] = [];
  constructor(actions: T[]) {
    this.actions = [...actions];
  }

  /**
   * Assumes that the actions are already sorted by head_id
   * @param actions
   */
  static fromArray<T extends StringableId>(actions: T[]): LinkedActionList<T> {
    if (actions.length === 0) {
      return new LinkedActionList(actions);
    }

    return new LinkedActionList(
      actions.map((action, index) => ({
        ...action,
        head_id: actions[index - 1]?.id ?? null,
      })),
    );
  }

  /**
   * Return the list of actions in B that have been changed compared to A
   */
  static diff<T extends StringableId>(
    prevActionList: LinkedActionList<T>,
    nextActionList: LinkedActionList<T>,
  ): T[] {
    const prevActions = prevActionList.actions;
    const nextActions = nextActionList.actions;

    const changedActions = nextActions.filter((nextAction) => {
      const prevAction = prevActions.find(
        (prevAction) => prevAction.id === nextAction.id,
      );

      const didActionExistInPreviousList = prevAction !== undefined;
      if (!didActionExistInPreviousList) {
        return true;
      }

      const hasActionChanged = !isEqual(prevAction, nextAction);

      return hasActionChanged;
    });

    return changedActions;
  }

  getActions(): T[] {
    return [...this.actions];
  }

  // Returns a new LinkedActionList where the action will be at the specified index
  moveTo(action: T, index: number): LinkedActionList<T> {
    const actionIndex = this.actions.findIndex(
      (currentAction) => currentAction.id === action.id,
    );

    if (actionIndex === -1) {
      return this;
    }

    if (index === actionIndex) {
      return this;
    }

    if (index < 0 || index >= this.actions.length) {
      return this;
    }

    // If the target index is lower than the current index, the operation is simple
    if (index < actionIndex) {
      const nextActions = [...this.actions];
      nextActions.splice(actionIndex, 1);
      nextActions.splice(index, 0, action);
      return LinkedActionList.fromArray(nextActions);
    }

    if (index > actionIndex) {
      const nextActions = [...this.actions];
      nextActions.splice(index + 1, 0, action);
      nextActions.splice(actionIndex, 1);
      return LinkedActionList.fromArray(nextActions);
    }

    throw new Error("This should never happen");
  }

  delete(action: T): LinkedActionList<T> {
    const actionIndex = this.actions.findIndex(
      (currentAction) => currentAction.id === action.id,
    );

    if (actionIndex === -1) {
      return this;
    }

    const nextActions = [...this.actions];
    nextActions.splice(actionIndex, 1);
    return LinkedActionList.fromArray(nextActions);
  }

  static deleteDiff<T extends StringableId>(actions: T[], action: T): T[] {
    const prevList = LinkedActionList.fromArray(actions);
    const nextList = prevList.delete(action);
    return LinkedActionList.diff(prevList, nextList);
  }

  static moveToDiff<T extends StringableId>(
    actions: T[],
    action: T,
    index: number,
  ): T[] {
    const prevList = LinkedActionList.fromArray(actions);
    const nextList = prevList.moveTo(action, index);
    return LinkedActionList.diff(prevList, nextList);
  }
}

export default LinkedActionList;
