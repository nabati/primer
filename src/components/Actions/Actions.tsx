import React from "react";
import useListActions from "../../hooks/useListActions.ts";
import useUpsertAction from "../../hooks/useUpsertAction.ts";
import ActionEditorRow from "./ActionEditorRow.tsx";
import CreateAction from "./CreateAction.tsx";
import Stack from "@mui/material/Stack";
import { Action } from "../../types.ts";
import { last } from "lodash";
import useSortedActions from "./hooks/useSortedActions.ts";

type ActionsProps = {
  priorityId: string;
};

const Actions: React.FC<ActionsProps> = ({ priorityId }) => {
  const { data } = useListActions({ priorityId });
  const { upsertAction } = useUpsertAction({ priorityId });
  const actions = useSortedActions(data ?? []);

  console.log("data", data);
  console.log("actions", actions);

  const handleComplete = async (
    action: Partial<Action> & { content: string },
  ) => {
    await upsertAction({ ...action });
  };

  return (
    <div>
      <Stack direction="column" gap={1}>
        {actions?.map((action) => (
          <ActionEditorRow
            key={action.id}
            action={action}
            priorityId={action.priorityId}
            onComplete={handleComplete}
          />
        ))}

        <CreateAction onComplete={handleComplete} headId={last(actions)?.id} />
      </Stack>
    </div>
  );
};

export default Actions;
