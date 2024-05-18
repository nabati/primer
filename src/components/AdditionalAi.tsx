import React from "react";
import prompts from "./prompts.ts";
import { usePassiveEditorContent } from "./store.ts";
import { useGptPrompt } from "./useGptPrompt.tsx";

type AdditionalAiProps = {};

const AdditionalAi: React.FC<AdditionalAiProps> = () => {
  const editorContent = usePassiveEditorContent();
  const { data: summaryResponse } = useGptPrompt({
    prompt: prompts.summary(editorContent, 50),
  });

  const { data: sentimentResponse } = useGptPrompt({
    prompt: prompts.sentiments(editorContent, 5),
  });

  return (
    <div>
      <div>
        <b>Summary:</b> {summaryResponse?.response}
      </div>
      <div>
        <b>Sentiments: {sentimentResponse?.response}</b>
      </div>
    </div>
  );
};

export default AdditionalAi;
