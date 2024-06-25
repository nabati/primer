import React from "react";
import useListActions from "../../hooks/useListActions.ts";
import useUpsertAction from "../../hooks/useUpsertAction.ts";
import useUpsertActions from "../../hooks/useUpsertActions.ts";
import ActionEditorRow from "./ActionEditorRow.tsx";
import CreateAction from "./CreateAction.tsx";
import Stack from "@mui/material/Stack";
import { Action } from "../../types.ts";
import { last } from "lodash";
import useSortedActions from "./hooks/useSortedActions.ts";
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import ShamefulStrictModeDroppable from "./ShamefulStrictModeDroppable.tsx";

type ActionsProps = {
  priorityId: string;
};

const Actions: React.FC<ActionsProps> = ({ priorityId }) => {
  const { data } = useListActions({ priorityId });
  const { upsertAction } = useUpsertAction({ priorityId });
  const { upsertActions } = useUpsertActions({ priorityId });
  const actions = useSortedActions(data ?? []);

  const handleComplete = async (
    action: Partial<Action> & { content: string },
  ) => {
    await upsertAction({ ...action });
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

    // TODO: Double check this one. Is it always defined, also at the end?
    const destinationAction = actions[destination.index];

    if (!destinationAction) {
      throw new Error("Expected this to be defined - confirm");
    }

    const destinationActionBefore =
      destination.index > 0 ? actions[destination.index - 1] : undefined;

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
    console.log("@@onDragEnd", destination);
  };

  // TODO: Handle the complete case also. You need to stitch the next item in the list with the
  // previous one.

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
