import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import useEventUpsert from "../../hooks/useEventUpsert.ts";

type CellProps = {
  habitId: string;
  date: Date;
  value: number | undefined;
  streak: number | undefined;
};

const MAX_INTENSITY = 100;
const MIN_INTENSITY = 25;

const mapStreakToIntensity = (streak: number | undefined): number => {
  if (streak === undefined) {
    return 100;
  }

  return Math.max(MIN_INTENSITY, MAX_INTENSITY - streak * 5);
};

const Cell: React.FC<CellProps> = ({
  habitId,
  date,
  value: remoteValue,
  streak,
}) => {
  const { upsert: upsertEvent, variables } = useEventUpsert();
  const value = variables?.value !== undefined ? variables.value : remoteValue;
  const handleDecrement = () => {
    upsertEvent({ date, value: Math.max((value ?? 0) - 1, 0), habitId });
  };
  const handleIncrement = () => {
    upsertEvent({ date, value: (value ?? 0) + 1, habitId });
  };

  // Make visible only on hover
  // Fix so that it actually does something on the backend

  return (
    <Container intensity={mapStreakToIntensity(streak)}>
      <DateC>{format(date, "dd/MM")}</DateC>
      <ValueContainer>
        <StyledButton onClick={handleDecrement}>
          <RemoveIcon fontSize="inherit" />
        </StyledButton>
        <Value>{value}</Value>
        <StyledButton onClick={handleIncrement}>
          <AddIcon fontSize="small" />
        </StyledButton>
      </ValueContainer>
    </Container>
  );
};

const ValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 8px;
`;

const blue = {
  100: "#daecff",
  200: "#b6daff",
  300: "#66b2ff",
  400: "#3399ff",
  500: "#007fff",
  600: "#0072e5",
  700: "#0059B2",
  800: "#004c99",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const StyledButton = styled("button")(
  () => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  line-height: 1.5;
  border: 1px solid;
  border-radius: 999px;
  border-color: ${grey[200]};
  background: ${grey[50]};
  color: ${grey[900]};
  width: 24px;
  height: 24px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
    background: ${blue[500]};
    border-color: ${blue[400]};
    color: ${grey[50]};
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`,
);

const DateC = styled.div`
  font-size: 0.7em;
  //font-weight: bold;
`;

const Value = styled.div`
  font-size: 2em;
  margin: 0.5em;
  font-weight: bold;
`;

const Container = styled.div<{ intensity: number }>`
  width: 5em;
  height: 5em;
  overflow: hidden;
  background-color: ${(props) => `hsl(135, 100%, ${props.intensity}%)`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default Cell;
