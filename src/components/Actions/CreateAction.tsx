import { Button } from "@mui/material";
import React from "react";
import useCreateAction from "../../hooks/useCreateAction";

type CreateActionProps = {
  priorityId: string;
};

const CreateAction: React.FC<CreateActionProps> = ({ ...props }) => {
  const { createAction } = useCreateAction();

  const handleCreateActionClick = async () => {
    const content = prompt("Enter action");

    if (content) {
      await createAction({ priorityId: props.priorityId, content });
    }
  };

  return <Button onClick={handleCreateActionClick}>Create action</Button>;
};

export default CreateAction;
