import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection } from "lexical";
import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import FloatingPromptToolbar from "./FloatingPromptToolbar.tsx";

type FloatingPromptProps = {
  anchorElement?: HTMLElement;
};

const FloatingPrompt: React.FC<FloatingPromptProps> = ({
  anchorElement = document.body,
}) => {
  const [editor] = useLexicalComposerContext();
  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }

      const selection = $getSelection();
      const rawTextContent = selection?.getTextContent().replace(/\n/g, "");

      if (!selection?.isCollapsed() && rawTextContent === "") {
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  return createPortal(
    <FloatingPromptToolbar anchorElement={anchorElement} editor={editor} />,
    anchorElement,
  );
};

export default FloatingPrompt;
