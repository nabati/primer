import React from "react";
import useActions from "../../hooks/useActions.ts";
import useUpsertAction from "../../hooks/useUpsertAction.ts";
import ActionEditorRow from "./ActionEditorRow.tsx";
import CreateAction from "./CreateAction.tsx";
import Stack from "@mui/material/Stack";
import { Action } from "../../types.ts";

type ActionsProps = {
  priorityId: string;
};

const Actions: React.FC<ActionsProps> = ({ priorityId }) => {
  const { data } = useActions({ priorityId });
  const { upsertAction } = useUpsertAction();

  const handleComplete = async (
    action: Partial<Action> & { content: string },
  ) => {
    await upsertAction({ ...action, priorityId });
  };

  return (
    <div>
      <Stack direction="column" gap={1}>
        {data?.map((action) => (
          <ActionEditorRow
            key={action.id}
            action={action}
            priorityId={action.priorityId}
            onComplete={handleComplete}
          />
        ))}

        <CreateAction onComplete={handleComplete} />
      </Stack>
    </div>
  );
};

export default Actions;
