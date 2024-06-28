import { Button } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import useWindowKeydown from "../../Priorities/Priority/hooks/useWindowKeydown.ts";
import { Action } from "../../types.ts";
import ActionEditor from "./ActionEditor.tsx";
import { v4 as uuid } from "uuid";

const useCreateNewActionKeyboardShortcut = (createNew: () => void) => {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      const tagsToIgnore = ["INPUT", "TEXTAREA"];
      const activeElement = document.activeElement;
      if (
        activeElement !== null &&
        (tagsToIgnore.includes(activeElement.tagName) ||
          activeElement.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (event.key === "a") {
        event.preventDefault();
        createNew();
      }
    },
    [createNew],
  );

  useWindowKeydown(handleKeydown);
};

type CreateActionProps = {
  headId: string | undefined;
  onComplete: ({ content }: { content: string }) => void;
};

const CreateAction: React.FC<CreateActionProps> = ({ headId, onComplete }) => {
  const [isCreatingId, setIsCreatingId] = React.useState<string | undefined>();
  const createNew = useCallback(() => {
    setIsCreatingId(uuid());
  }, []);

  useCreateNewActionKeyboardShortcut(createNew);

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
    return <Button onClick={createNew}>Create action</Button>;
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
