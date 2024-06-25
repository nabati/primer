import { Button } from "@mui/material";
import React from "react";
import { Action } from "../../types.ts";
import ActionEditor from "./ActionEditor.tsx";
import { v4 as uuid } from "uuid";

type CreateActionProps = {
  headId: string | undefined;
  onComplete: ({ content }: { content: string }) => void;
};

const CreateAction: React.FC<CreateActionProps> = ({ headId, onComplete }) => {
  const [isCreatingId, setIsCreatingId] = React.useState<string | undefined>();

  const handleComplete = async (
    action: Partial<Action> & { content: string },
  ) => {
    onComplete(action);
    setIsCreatingId(uuid());
  };

  const handleCancel = () => {
    setIsCreatingId(undefined);
  };

  if (isCreatingId === undefined) {
    return (
      <Button onClick={() => setIsCreatingId(uuid())}>Create action</Button>
    );
  }

  return (
    <ActionEditor
      key={isCreatingId}
      action={{
        id: isCreatingId,
        head_id: headId,
      }}
      onComplete={handleComplete}
      onCancel={handleCancel}
    />
  );
};

export default CreateAction;
