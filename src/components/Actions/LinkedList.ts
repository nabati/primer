// Keep separate lists between local and remote, and keep track of when something is being edited

import { isEqual } from "lodash";

type StringableId = { id: string };

class LinkedList<T extends StringableId> {
  private items: T[] = [];
  constructor(items: T[]) {
    this.items = [...items];
  }

  /**
   * Assumes that the items are already sorted by head_id
   * @param items
   */
  static fromArray<T extends StringableId>(items: T[]): LinkedList<T> {
    if (items.length === 0) {
      return new LinkedList(items);
    }

    return new LinkedList(
      items.map((item, index) => ({
        ...item,
        head_id: items[index - 1]?.id ?? null,
      })),
    );
  }

  /**
   * Return the list of items in B that have been changed compared to A
   */
  static diff<T extends StringableId>(
    prevList: LinkedList<T>,
    nextList: LinkedList<T>,
  ): T[] {
    const prevItems = prevList.items;
    const nextItems = nextList.items;

    const changedItems = nextItems.filter((nextItem) => {
      const prevItem = prevItems.find(
        (prevItem) => prevItem.id === nextItem.id,
      );

      const didItemExistInPreviousList = prevItem !== undefined;
      if (!didItemExistInPreviousList) {
        return true;
      }

      return !isEqual(prevItem, nextItem);
    });

    return changedItems;
  }

  getItems(): T[] {
    return [...this.items];
  }

  // Returns a new LinkedList where the item will be at the specified index
  moveTo(item: T, index: number): LinkedList<T> {
    const itemIndex = this.items.findIndex(
      (currentItem) => currentItem.id === item.id,
    );

    if (itemIndex === -1) {
      return this;
    }

    if (index === itemIndex) {
      return this;
    }

    if (index < 0 || index >= this.items.length) {
      return this;
    }

    // If the target index is lower than the current index, the operation is simple
    if (index < itemIndex) {
      const nextItems = [...this.items];
      nextItems.splice(itemIndex, 1);
      nextItems.splice(index, 0, item);
      return LinkedList.fromArray(nextItems);
    }

    if (index > itemIndex) {
      const nextItems = [...this.items];
      nextItems.splice(index + 1, 0, item);
      nextItems.splice(itemIndex, 1);
      return LinkedList.fromArray(nextItems);
    }

    throw new Error("This should never happen");
  }

  delete(item: T): LinkedList<T> {
    const itemIndex = this.items.findIndex(
      (currentItem) => currentItem.id === item.id,
    );

    if (itemIndex === -1) {
      return this;
    }

    const nextItems = [...this.items];
    nextItems.splice(itemIndex, 1);
    return LinkedList.fromArray(nextItems);
  }

  static deleteDiff<T extends StringableId>(items: T[], item: T): T[] {
    const prevList = LinkedList.fromArray(items);
    const nextList = prevList.delete(item);
    return LinkedList.diff(prevList, nextList);
  }

  static moveToDiff<T extends StringableId>(
    items: T[],
    item: T,
    index: number,
  ): T[] {
    const prevList = LinkedList.fromArray(items);
    const nextList = prevList.moveTo(item, index);
    return LinkedList.diff(prevList, nextList);
  }
}

export default LinkedList;
