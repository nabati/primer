import "./f.css";
import { mergeRegister } from "@lexical/utils";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Button from "@mui/material/Button";
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef } from "react";
import { getDOMRangeRect } from "./getDomRangeRect.ts";
import getRawSelection from "./getRawSelection.ts";
import prompts from "./prompts.ts";
import { setFloatingElemPosition } from "./setFloatingElemPosition.ts";
import { setPrompt, usePassiveEditorContent } from "./store.ts";

const FloatingPromptToolbar = ({
  editor,
  anchorElement,
}: {
  editor: LexicalEditor;
  anchorElement: HTMLElement;
}): JSX.Element => {
  const popupToolbarContainerRef = useRef<HTMLDivElement | null>(null);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupToolbarContainerRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(
        rangeRect,
        popupCharStylesEditorElem,
        anchorElement,
      );
    }
  }, [editor, anchorElement]);

  // useEffect(() => {
  //   const scrollerElem = anchorElem.parentElement;
  //
  //   const update = () => {
  //     editor.getEditorState().read(() => {
  //       $updateTextFormatFloatingToolbar();
  //     });
  //   };
  //
  //   window.addEventListener("resize", update);
  //   if (scrollerElem) {
  //     scrollerElem.addEventListener("scroll", update);
  //   }
  //
  //   return () => {
  //     window.removeEventListener("resize", update);
  //     if (scrollerElem) {
  //       scrollerElem.removeEventListener("scroll", update);
  //     }
  //   };
  // }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  const editorContent = usePassiveEditorContent();

  const handleDrillingClick = () => {
    editor.getEditorState().read(() => {
      const selection = getRawSelection();
      if (selection === undefined) {
        return;
      }
      setPrompt(prompts.selection(editorContent, selection));
    });
  };

  return (
    <div ref={popupToolbarContainerRef} className="floating-text-format-popup">
      <Button onClick={handleDrillingClick}>
        <QuestionAnswerIcon />
      </Button>
    </div>
  );
};

export default FloatingPromptToolbar;
