import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import FloatingPromptToolbar from "./FloatingPromptToolbar.tsx";
import { $getSelection, $isRangeSelection } from "lexical";
import { mergeRegister } from "@lexical/utils";

type FloatingPromptProps = {
  anchorElement?: HTMLElement;
};

const FloatingPrompt: React.FC<FloatingPromptProps> = ({
  anchorElement = document.body,
}) => {
  const [editor] = useLexicalComposerContext();
  const [isTextSelected, setIsTextSelected] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();

      if (selection === null) {
        setIsTextSelected(false);
        return;
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, "");
      if (rawTextContent === "") {
        setIsTextSelected(false);
        return;
      }

      setIsTextSelected(true);
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  if (!isTextSelected) {
    return null;
  }

  return createPortal(
    <FloatingPromptToolbar anchorElement={anchorElement} editor={editor} />,
    anchorElement,
  );
};

export default FloatingPrompt;
