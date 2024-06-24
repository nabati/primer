import EditIcon from "@mui/icons-material/Edit";
import { Button, TextField } from "@mui/material";
import React from "react";
import styled from "styled-components";

type EditableFieldProps = {
  display: React.ReactNode;
  initialValue: string;
  onCancel: () => void;
  onComplete: (value: string) => void;
};

// By default it's a static display, but once hovered, it shows an edit button that becomes
// a text field, and the text field can be saved with a save button.
const EditableField: React.FC<EditableFieldProps> = ({
  display,
  initialValue,
  onCancel,
  onComplete,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [value, setValue] = React.useState(initialValue);

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
    onCancel();
  };

  const handleComplete = () => {
    setIsEditing(false);
    onComplete(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleComplete();
    }

    if (event.key === "Escape") {
      handleCancel();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  if (!isEditing) {
    return (
      <DisplayContainer>
        {display}

        <Button variant="text" size="small" onClick={() => setIsEditing(true)}>
          <EditIcon />
        </Button>
      </DisplayContainer>
    );
  }

  return (
    <TextField
      size="small"
      onKeyDown={handleKeyDown}
      value={value}
      onChange={handleChange}
      autoFocus
    />
  );
};

const DisplayContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export default EditableField;
