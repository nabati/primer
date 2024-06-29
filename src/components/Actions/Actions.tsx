import React, { useCallback, useEffect } from "react";
import useListActions from "../../hooks/useListActions.ts";
import useUpsertAction from "../../hooks/useUpsertAction.ts";
import useUpsertActions from "../../hooks/useUpsertActions.ts";
import useWindowKeydown from "../../Priorities/Priority/hooks/useWindowKeydown.ts";
import isActiveElementDescendantOfElement from "../../utils/isActiveElementDescendantOfElement.ts";
import isActiveElementEditable from "../../utils/isActiveElementEditable.ts";
import ActionEditorRow from "./ActionEditorRow.tsx";
import CreateAction from "./CreateAction.tsx";
import Stack from "@mui/material/Stack";
import { Action } from "../../types.ts";
import { last } from "lodash";
import getLinkedActionList from "./getLinkedActionList.ts";
import useSortedActions from "./hooks/useSortedActions.ts";
import {
  DragDropContext,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import isValidActionList from "./isValidActionList.ts";
import ShamefulStrictModeDroppable from "./ShamefulStrictModeDroppable.tsx";

type ActionsProps = {
  priorityId: string;
};

const useArrowKeysToNavigateKeyboardShortCuts = ({
  actions,
  isEditingActionId,
  setIsEditingActionId,
  containerRef,
}: {
  actions: Action[];
  isEditingActionId: string | null;
  setIsEditingActionId: (id: string | null) => void;
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (
        isActiveElementEditable() &&
        !isActiveElementDescendantOfElement(containerRef.current)
      ) {
        return;
      }

      if (event.metaKey && event.key === "ArrowDown") {
        event.preventDefault();
        const currentIndex = actions.findIndex(
          (action) => action.id === isEditingActionId,
        );

        if (currentIndex === -1) {
          return;
        }

        const nextAction = actions[currentIndex + 1];
        if (nextAction !== undefined) {
          setIsEditingActionId(nextAction.id);
        }
      }

      if (event.metaKey && event.key === "ArrowUp") {
        event.preventDefault();
        const currentIndex = actions.findIndex(
          (action) => action.id === isEditingActionId,
        );

        if (currentIndex === -1) {
          return;
        }

        const previousAction = actions[currentIndex - 1];
        if (previousAction !== undefined) {
          setIsEditingActionId(previousAction.id);
        }
      }
    },
    [actions, isEditingActionId, setIsEditingActionId],
  );

  useWindowKeydown(handleKeydown);
};

const Actions: React.FC<ActionsProps> = ({ priorityId }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { data } = useListActions({ priorityId });
  const { upsertAction } = useUpsertAction({ priorityId });
  const { upsertActions } = useUpsertActions({ priorityId });
  useEffect(() => {
    if (data === undefined) {
      return;
    }

    if (!isValidActionList(data)) {
      // This should really only be run if there have been previous issues
      upsertActions(getLinkedActionList(data));
    }
  }, [data, upsertActions]);

  const actions = useSortedActions(data ?? []);

  const [isEditingActionId, setIsEditingActionId] = React.useState<
    string | null
  >(null);

  useArrowKeysToNavigateKeyboardShortCuts({
    actions,
    isEditingActionId,
    setIsEditingActionId,
    containerRef,
  });

  const handleComplete = async (
    action: Partial<Action> & { content: string },
  ) => {
    setIsEditingActionId(null);
    if (action.completed_at === null || action.completed_at === undefined) {
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
        head_id: null,
      },
      ...(nextAction !== undefined
        ? [
            {
              ...nextAction,
              head_id: previousAction?.id ?? null,
            },
          ]
        : []),
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
        head_id: destinationActionBefore?.id ?? null,
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
              head_id: sourceActionBefore?.id ?? null,
            },
          ]
        : []),
    ];

    upsertActions(updatedActions);
  };

  return (
    <div ref={containerRef}>
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
                          isEditing={isEditingActionId === action.id}
                          onEdit={() => setIsEditingActionId(action.id)}
                          onCancel={() => setIsEditingActionId(null)}
                          action={action}
                          priorityId={action.priorityId}
                          onUpdate={upsertAction}
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
