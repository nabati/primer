import { Button } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import useListActions from "../../hooks/useListActions.ts";
import useUpsertAction from "../../hooks/useUpsertAction.ts";
import useUpsertActions from "../../hooks/useUpsertActions.ts";
import useWindowKeydown from "../../Priorities/Priority/hooks/useWindowKeydown.ts";
import isActiveElementDescendantOfElement from "../../utils/isActiveElementDescendantOfElement.ts";
import isActiveElementEditable from "../../utils/isActiveElementEditable.ts";
import ActionEditorRow from "./ActionEditorRow.tsx";
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
import LinkedList from "./LinkedList.ts";
import ShamefulStrictModeDroppable from "./ShamefulStrictModeDroppable.tsx";
import { v4 as uuid } from "uuid";

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

const useCreateNewActionKeyboardShortcut = (createNew: () => void) => {
  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (isActiveElementEditable()) {
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

const Actions: React.FC<ActionsProps> = ({ priorityId }) => {
  const [nextActionState, setNextActionState] = React.useState<{
    id: string;
    beforeId: string | undefined;
  }>({
    id: uuid(),
    beforeId: undefined,
  });
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
  useCreateNewActionKeyboardShortcut(() => {
    setIsEditingActionId(nextActionState.id);
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

  const handleCreate = (action: Action) => {
    setIsEditingActionId(null);

    const foundIndex = actions.findIndex((a) => a.id === action.head_id);
    const index = foundIndex === -1 ? 0 : foundIndex + 1;
    upsertActions(LinkedList.insertAtDiff(actions, index, action));
  };

  const onDragEnd: OnDragEndResponder = ({ destination, source }) => {
    if (destination === null || destination === undefined) {
      return;
    }

    upsertActions(
      LinkedList.moveToDiff(actions, actions[source.index], destination.index),
    );
  };

  const handleCreateNew = (beforeAction: Action | undefined) => {
    // Injects an action before the specified reference action
    const id = uuid();
    setIsEditingActionId(id);
    setNextActionState({
      id,
      beforeId: beforeAction?.id,
    });
  };

  return (
    <div ref={containerRef}>
      <Stack direction="column" gap={1}>
        <DragDropContext onDragEnd={onDragEnd}>
          <ShamefulStrictModeDroppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {actions.map((action, index) => (
                  <React.Fragment key={action.id}>
                    {isEditingActionId === nextActionState.id &&
                      nextActionState.beforeId === action.id && (
                        <ActionEditorRow
                          key={nextActionState.id}
                          id={nextActionState.id}
                          action={{
                            id: nextActionState.id,
                            head_id: actions[index - 1]?.id,
                          }}
                          onComplete={(nextAction) => {
                            handleCreate(nextAction);
                            const nextId = uuid();
                            setNextActionState({
                              id: nextId,
                              beforeId: action.id,
                            });
                            setIsEditingActionId(nextId);
                          }}
                          onEdit={() =>
                            setIsEditingActionId(nextActionState.id)
                          }
                          onCancel={() => setIsEditingActionId(null)}
                          isEditing
                        />
                      )}
                    <Draggable draggableId={action.id} index={index}>
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
                            onCreateNewBefore={() => handleCreateNew(action)}
                            onCreateNewAfter={() =>
                              handleCreateNew(actions[index + 1])
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  </React.Fragment>
                ))}
                {provided.placeholder}
              </div>
            )}
          </ShamefulStrictModeDroppable>
        </DragDropContext>
        <>
          {isEditingActionId == null && (
            <Button onClick={() => setIsEditingActionId(nextActionState.id)}>
              Create action
            </Button>
          )}
          {isEditingActionId === nextActionState.id &&
            nextActionState.beforeId === undefined && (
              <ActionEditorRow
                key={nextActionState.id}
                id={nextActionState.id}
                action={{
                  id: isEditingActionId,
                  head_id: last(actions)?.id ?? null,
                }}
                onComplete={(action) => {
                  handleCreate(action);
                  const nextId = uuid();
                  setNextActionState({
                    id: nextId,
                    beforeId: undefined,
                  });
                  setIsEditingActionId(nextId);
                }}
                onEdit={() => setIsEditingActionId(nextActionState.id)}
                isEditing
                onCancel={() => setIsEditingActionId(null)}
              />
            )}
        </>
      </Stack>
    </div>
  );
};

export default Actions;
