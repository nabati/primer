import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState, LexicalEditor } from "lexical";
import {
  $convertToMarkdownString,
  $convertFromMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { useCallback } from "react";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

const theme = {};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

type EditorProps = {
  initialValue?: string;
  /**
   * Returns the text content of the editor as Markdown.
   * @param text
   */
  onChange?: (text: string) => void;
  editorRef: React.RefObject<LexicalEditor>;
};

const Editor: React.FC<EditorProps> = ({
  initialValue = "",
  onChange,
  editorRef,
}) => {
  const initialConfig = {
    namespace: "Editor",
    theme,
    onError,
    editorState: () => $convertFromMarkdownString(initialValue, TRANSFORMERS),
    nodes: [
      HorizontalRuleNode,
      CodeNode,
      LinkNode,
      ListNode,
      ListItemNode,
      HeadingNode,
      QuoteNode,
    ],
  };

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        // Read the contents of the EditorState here.
        const markdownString = $convertToMarkdownString(TRANSFORMERS);
        onChange?.(markdownString);
      });
    },
    [onChange],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            style={{
              width: "50em",
              height: "100%",
              border: "2px solid green",
              padding: "16px",
            }}
          />
        }
        placeholder={<div></div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <OnChangePlugin onChange={handleChange} />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <EditorRefPlugin editorRef={editorRef} />
    </LexicalComposer>
  );
};

export default Editor;
