import React, { useEffect } from "react";
import useListActions from "../../hooks/useListActions.ts";
import useUpsertAction from "../../hooks/useUpsertAction.ts";
import useUpsertActions from "../../hooks/useUpsertActions.ts";
import ActionEditorRow from "./ActionEditorRow.tsx";
import CreateAction from "./CreateAction.tsx";
import Stack from "@mui/material/Stack";
import { Action } from "../../types.ts";
import { last } from "lodash";
import getLinkedActionList from "./getLinkedActionList.ts";
import useSortedActions from "./hooks/useSortedActions.ts";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import isValidActionList from "./isValidActionList.ts";
import ShamefulStrictModeDroppable from "./ShamefulStrictModeDroppable.tsx";

type ActionsProps = {
  priorityId: string;
};

const Actions: React.FC<ActionsProps> = ({ priorityId }) => {
  const { data } = useListActions({ priorityId });
  const { upsertAction } = useUpsertAction({ priorityId });
  const { upsertActions } = useUpsertActions({ priorityId });
  useEffect(() => {
    if (data === undefined) {
      return;
    }

    if (!isValidActionList(data)) {
      // This should really only be run if there have been previous issues
      console.warn("@@not valid action list");
      upsertActions(getLinkedActionList(data));
    }
  }, [data, upsertActions]);

  const actions = useSortedActions(data ?? []);

  const handleComplete = async (
    action: Partial<Action> & { content: string },
  ) => {
    if (action.completed_at === undefined) {
      // Single row action
      await upsertAction({ ...action });
      return;
    }

    // Multiple row action
    const actionIndex = actions.findIndex(
      (currentAction) => currentAction.id === action.id,
    );
    const previousAction = actions[actionIndex - 1];
    const nextAction = actions[actionIndex + 1];

    await upsertActions([
      {
        ...action,
        head_id: undefined,
      },
      {
        ...nextAction,
        head_id: previousAction?.id,
      },
    ]);
  };

  const onDragEnd: OnDragEndResponder = ({ destination, source, ...other }) => {
    if (destination === null || destination === undefined) {
      return;
    }

    const sourceAction = actions[source.index];

    const sourceActionBefore =
      source.index > 0 ? actions[source.index - 1] : undefined;

    const sourceActionAfter =
      source.index < actions.length - 1 ? actions[source.index + 1] : undefined;

    const computedDestinationIndex =
      source.index > destination.index
        ? destination.index
        : destination.index + 1;
    const destinationAction =
      computedDestinationIndex < actions.length
        ? actions[computedDestinationIndex]
        : undefined;

    const destinationActionBefore =
      computedDestinationIndex > 0
        ? actions[computedDestinationIndex - 1]
        : undefined;

    const updatedActions = [
      // Link together the sourceAction with the item before the destinationAction
      {
        ...sourceAction,
        head_id: destinationActionBefore?.id,
      },
      ...(destinationAction !== undefined
        ? [
            {
              ...destinationAction,
              head_id: sourceAction.id,
            },
          ]
        : []),
      ...(sourceActionAfter !== undefined
        ? [
            {
              ...sourceActionAfter,
              head_id: sourceActionBefore?.id,
            },
          ]
        : []),
    ];

    upsertActions(updatedActions);
  };

  return (
    <div>
      <Stack direction="column" gap={1}>
        <DragDropContext onDragEnd={onDragEnd}>
          <ShamefulStrictModeDroppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {actions.map((action, index) => (
                  <Draggable
                    key={action.id}
                    draggableId={action.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ActionEditorRow
                          action={action}
                          priorityId={action.priorityId}
                          onComplete={handleComplete}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </ShamefulStrictModeDroppable>
        </DragDropContext>
        <CreateAction onComplete={handleComplete} headId={last(actions)?.id} />
      </Stack>
    </div>
  );
};

export default Actions;
