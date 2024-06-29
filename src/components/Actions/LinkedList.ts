// Keep separate lists between local and remote, and keep track of when something is being edited

import { isEqual } from "lodash";

type StringableId = { id: string };

class LinkedList<T extends StringableId> {
  private items: T[] = [];
  constructor(items: T[]) {
    this.items = [...items];
  }

  /**
   * Assumes that the actions are already sorted by head_id
   * @param items
   */
  static fromArray<T extends StringableId>(items: T[]): LinkedList<T> {
    if (items.length === 0) {
      return new LinkedList(items);
    }

    return new LinkedList(
      items.map((action, index) => ({
        ...action,
        head_id: items[index - 1]?.id ?? null,
      })),
    );
  }

  /**
   * Return the list of actions in B that have been changed compared to A
   */
  static diff<T extends StringableId>(
    prevList: LinkedList<T>,
    nextList: LinkedList<T>,
  ): T[] {
    const prevItems = prevList.items;
    const nextItems = nextList.items;

    const changedActions = nextItems.filter((nextAction) => {
      const prevAction = prevItems.find(
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
    return [...this.items];
  }

  // Returns a new LinkedActionList where the action will be at the specified index
  moveTo(action: T, index: number): LinkedList<T> {
    const actionIndex = this.items.findIndex(
      (currentAction) => currentAction.id === action.id,
    );

    if (actionIndex === -1) {
      return this;
    }

    if (index === actionIndex) {
      return this;
    }

    if (index < 0 || index >= this.items.length) {
      return this;
    }

    // If the target index is lower than the current index, the operation is simple
    if (index < actionIndex) {
      const nextActions = [...this.items];
      nextActions.splice(actionIndex, 1);
      nextActions.splice(index, 0, action);
      return LinkedList.fromArray(nextActions);
    }

    if (index > actionIndex) {
      const nextActions = [...this.items];
      nextActions.splice(index + 1, 0, action);
      nextActions.splice(actionIndex, 1);
      return LinkedList.fromArray(nextActions);
    }

    throw new Error("This should never happen");
  }

  delete(action: T): LinkedList<T> {
    const actionIndex = this.items.findIndex(
      (currentAction) => currentAction.id === action.id,
    );

    if (actionIndex === -1) {
      return this;
    }

    const nextActions = [...this.items];
    nextActions.splice(actionIndex, 1);
    return LinkedList.fromArray(nextActions);
  }

  static deleteDiff<T extends StringableId>(actions: T[], action: T): T[] {
    const prevList = LinkedList.fromArray(actions);
    const nextList = prevList.delete(action);
    return LinkedList.diff(prevList, nextList);
  }

  static moveToDiff<T extends StringableId>(
    actions: T[],
    action: T,
    index: number,
  ): T[] {
    const prevList = LinkedList.fromArray(actions);
    const nextList = prevList.moveTo(action, index);
    return LinkedList.diff(prevList, nextList);
  }
}

export default LinkedList;
