import { Button } from "@mui/material";
import React from "react";
import { Action } from "../../types.ts";
import ActionEditor from "./ActionEditor.tsx";

type CreateActionProps = {
  headId: string | undefined;
  onComplete: ({ content }: { content: string }) => void;
};

const CreateAction: React.FC<CreateActionProps> = ({ headId, onComplete }) => {
  const [isCreating, setIsCreating] = React.useState(false);

  const handleComplete = async (
    action: Partial<Action> & { content: string },
  ) => {
    setIsCreating(false);
    onComplete(action);
    setTimeout(() => {
      setIsCreating(true);
    }, 100);
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  if (!isCreating) {
    return <Button onClick={() => setIsCreating(true)}>Create action</Button>;
  }

  return (
    <ActionEditor
      action={{
        head_id: headId,
      }}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
};

export default CreateAction;
