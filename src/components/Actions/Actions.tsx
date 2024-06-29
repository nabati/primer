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
import { isEqual, last } from "lodash";
import getLinkedActionList from "./getLinkedActionList.ts";
import useSortedActions from "./hooks/useSortedActions.ts";
import {
  DragDropContext,
  Draggable,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import isValidActionList from "./isValidActionList.ts";
import LinkedList from "./LinkedList.ts";
import ShamefulStrictModeDroppable from "./ShamefulStrictModeDroppable.tsx";

type ActionsProps = {
  priorityId: string;
};

const useActionsKeyboardShortCuts = ({
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

  useActionsKeyboardShortCuts({
    actions,
    isEditingActionId,
    setIsEditingActionId,
    containerRef,
  });

  const handleComplete = async (
    action: Partial<Action> & { id: string; content: string },
  ) => {
    setIsEditingActionId(null);
    if (action.completed_at === null || action.completed_at === undefined) {
      // Single row action
      await upsertAction({ ...action });
      return;
    }

    const diffActions = LinkedList.deleteDiff(actions, action);

    await upsertActions([
      {
        ...action,
        head_id: null,
      },
      ...diffActions,
    ]);
  };

  const onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    if (destination === null || destination === undefined) {
      return;
    }

    upsertActions(
      LinkedList.moveToDiff(actions, actions[source.index], destination.index),
    );
  };

  const handleCreateNewBefore = () => {
    // Injects an action before the specified reference action
    setIsEditingActionId(null);
  };

  const handleCreateNewAfter = () => {
    // Injects an action after the specified reference action
    setIsEditingActionId(null);
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
                          onCreateNewBefore={handleCreateNewBefore}
                          onCreateNewAfter={handleCreateNewAfter}
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
