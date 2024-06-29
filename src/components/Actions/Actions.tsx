import { Button } from "@mui/material";
import React, { useCallback, useEffect, useMemo } from "react";
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

type NextActionState = {
  id: string | undefined;
  beforeId: string | undefined;
};

const useActionsKeyboardShortCuts = ({
  actions,
  containerRef,
  nextActionState,
  setNextActionState,
}: {
  actions: Action[];
  containerRef: React.RefObject<HTMLDivElement>;
  nextActionState: NextActionState;
  setNextActionState: (nextActionState: NextActionState) => void;
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
        const currentIndex = actions.findIndex((action, index) => {
          if (action.id === nextActionState.id) {
            return true;
          }

          if (nextActionState.beforeId === undefined) {
            return false;
          }

          if (actions[index + 1]?.id === nextActionState.beforeId) {
            return true;
          }

          return false;
        });

        if (currentIndex === -1) {
          if (nextActionState.beforeId !== undefined) {
            setNextActionState({
              id: actions[0]?.id,
              beforeId: undefined,
            });
          }
          return;
        }

        const nextAction = actions[currentIndex + 1];
        if (nextAction !== undefined) {
          setNextActionState({
            id: nextAction.id,
            beforeId: undefined,
          });
          return;
        }

        // At the bottom of the list
        setNextActionState({
          id: uuid(),
          beforeId: undefined,
        });
        return;
      }

      if (event.metaKey && event.key === "ArrowUp") {
        event.preventDefault();
        const currentIndex = actions.findIndex((action) => {
          if (action.id === nextActionState.id) {
            return true;
          }

          if (nextActionState.beforeId === undefined) {
            return false;
          }

          if (action.id === nextActionState.beforeId) {
            return true;
          }

          return false;
        });

        if (currentIndex === -1) {
          // Bottom of the list, creating a new one.
          setNextActionState({
            id: actions[actions.length - 1]?.id,
            beforeId: undefined,
          });
          return;
        }

        const previousAction = actions[currentIndex - 1];
        if (previousAction !== undefined) {
          setNextActionState({
            id: previousAction.id,
            beforeId: undefined,
          });
          return;
        }

        // At the top of the list
        if (
          nextActionState.beforeId !== actions[0]?.id ||
          nextActionState.id === undefined
        ) {
          setNextActionState({
            id: uuid(),
            beforeId: actions[0]?.id,
          });
          return;
        }

        return;
      }
    },
    [
      actions,
      containerRef,
      nextActionState.beforeId,
      nextActionState.id,
      setNextActionState,
    ],
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
  const [nextActionState, setNextActionState] = React.useState<NextActionState>(
    {
      id: undefined,
      beforeId: undefined,
    },
  );
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

  useActionsKeyboardShortCuts({
    actions,
    nextActionState,
    setNextActionState,
    containerRef,
  });
  useCreateNewActionKeyboardShortcut(() => {
    setNextActionState({
      id: uuid(),
      beforeId: undefined,
    });
  });

  const handleComplete = async (
    action: Partial<Action> & { id: string; content: string },
  ) => {
    setNextActionState({
      id: undefined,
      beforeId: undefined,
    });
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
    setNextActionState({
      id: uuid(),
      beforeId: beforeAction?.id,
    });
  };

  const isCreatingNewAction = useMemo(
    () =>
      actions.find((action) => action.id === nextActionState.id) === undefined,
    [actions, nextActionState.id],
  );

  return (
    <div ref={containerRef}>
      <Stack direction="column" gap={1}>
        <DragDropContext onDragEnd={onDragEnd}>
          <ShamefulStrictModeDroppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {actions.map((action, index) => (
                  <React.Fragment key={action.id}>
                    {nextActionState.id !== undefined &&
                      nextActionState.beforeId === action.id &&
                      isCreatingNewAction && (
                        <ActionEditorRow
                          key={nextActionState.id}
                          id={nextActionState.id}
                          action={{
                            id: nextActionState.id,
                            head_id: actions[index - 1]?.id,
                          }}
                          onComplete={(nextAction) => {
                            handleCreate(nextAction);
                            setNextActionState({
                              id: uuid(),
                              beforeId: action.id,
                            });
                          }}
                          onEdit={() =>
                            setNextActionState({
                              id: nextActionState.id,
                              beforeId: undefined,
                            })
                          }
                          onCancel={() => {
                            setNextActionState({
                              id: undefined,
                              beforeId: undefined,
                            });
                          }}
                          isEditing
                          maxIndentation={
                            actions[index - 1]?.indentation + 1 ?? 1
                          }
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
                            isEditing={nextActionState.id === action.id}
                            onEdit={() =>
                              setNextActionState({
                                id: action.id,
                                beforeId: undefined,
                              })
                            }
                            onCancel={() =>
                              setNextActionState({
                                id: undefined,
                                beforeId: undefined,
                              })
                            }
                            action={action}
                            priorityId={action.priorityId}
                            onComplete={handleComplete}
                            onCreateNewBefore={() => handleCreateNew(action)}
                            onCreateNewAfter={() =>
                              handleCreateNew(actions[index + 1])
                            }
                            maxIndentation={
                              actions[index - 1]?.indentation + 1 ?? 1
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
          {nextActionState.id == null && (
            <Button
              onClick={() =>
                setNextActionState({
                  id: uuid(),
                  beforeId: undefined,
                })
              }
            >
              Create action
            </Button>
          )}
          {nextActionState.id !== undefined &&
            nextActionState.beforeId === undefined &&
            isCreatingNewAction && (
              <ActionEditorRow
                key={nextActionState.id}
                id={nextActionState.id}
                action={{
                  id: nextActionState.id,
                  head_id: last(actions)?.id ?? null,
                }}
                onComplete={(action) => {
                  handleCreate(action);
                  setNextActionState({
                    id: uuid(),
                    beforeId: undefined,
                  });
                }}
                isEditing
                onCancel={() => {
                  setNextActionState({
                    id: undefined,
                    beforeId: undefined,
                  });
                }}
                maxIndentation={actions[actions.length - 1]?.indentation + 1}
              />
            )}
        </>
      </Stack>
    </div>
  );
};

export default Actions;
