import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React from "react";
import { createPortal } from "react-dom";
import FloatingPromptToolbar from "./FloatingPromptToolbar.tsx";

type FloatingPromptProps = {
  anchorElement?: HTMLElement;
};

const FloatingPrompt: React.FC<FloatingPromptProps> = ({
  anchorElement = document.body,
}) => {
  const [editor] = useLexicalComposerContext();
  return createPortal(
    <FloatingPromptToolbar anchorElement={anchorElement} editor={editor} />,
    anchorElement,
  );
};

export default FloatingPrompt;
