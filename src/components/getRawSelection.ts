import { $getSelection } from "lexical";

const getRawSelection = (): string | undefined => {
  const selection = $getSelection();
  const rawTextContent = selection?.getTextContent().replace(/\n/g, "");

  if (!selection?.isCollapsed() && rawTextContent === "") {
    return;
  }

  return rawTextContent;
};

export default getRawSelection;
