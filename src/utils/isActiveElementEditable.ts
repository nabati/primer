const tagsToIgnore = ["INPUT", "TEXTAREA"];
const isActiveElementEditable = (): boolean => {
  const activeElement = document.activeElement;
  return (
    activeElement !== null &&
    (tagsToIgnore.includes(activeElement.tagName) ||
      activeElement.getAttribute("contenteditable") === "true")
  );
};

export default isActiveElementEditable;
