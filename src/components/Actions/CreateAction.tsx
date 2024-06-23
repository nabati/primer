import { Button } from "@mui/material";
import React from "react";
import { Action } from "../../types.ts";
import ActionEditor from "./ActionEditor.tsx";

type CreateActionProps = {
  onComplete: ({ content }: { content: string }) => void;
};

const CreateAction: React.FC<CreateActionProps> = ({ onComplete }) => {
  const [isCreating, setIsCreating] = React.useState(false);

  const handleComplete = async (
    action: Partial<Action> & { content: string },
  ) => {
    setIsCreating(false);
    onComplete(action);
  };

  if (!isCreating) {
    return <Button onClick={() => setIsCreating(true)}>Create action</Button>;
  }

  return <ActionEditor action={{}} onComplete={handleComplete} />;
};

export default CreateAction;