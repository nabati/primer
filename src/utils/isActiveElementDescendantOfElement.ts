const isActiveElementDescendantOfElement = (
  node: HTMLElement | null,
): boolean => {
  const activeElement = document.activeElement;
  if (activeElement === null) {
    return false;
  }

  if (node === null) {
    return false;
  }

  return node.contains(activeElement);
};

export default isActiveElementDescendantOfElement;
