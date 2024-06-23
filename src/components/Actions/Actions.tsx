import React from "react";
import useActions from "../../hooks/useActions.ts";
import CreateAction from "./CreateAction.tsx";

type ActionsProps = {
  priorityId: string;
};

const Actions: React.FC<ActionsProps> = ({ ...props }) => {
  const { data } = useActions({ priorityId: props.priorityId });
  return (
    <div>
      {data?.map((action) => (
        <div key={action.id}>
          <div>{action.content}</div>
        </div>
      ))}

      <CreateAction priorityId={props.priorityId} />
    </div>
  );
};

export default Actions;
