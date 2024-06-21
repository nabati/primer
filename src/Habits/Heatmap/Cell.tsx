import React from "react";
import styled from "styled-components";
import { format } from "date-fns";

type CellProps = {
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

const Cell: React.FC<CellProps> = ({ date, value, streak }) => (
  <Container intensity={mapStreakToIntensity(streak)}>
    <DateC>{format(date, "dd/MM")}</DateC> <Value>{value}</Value>
  </Container>
);

const DateC = styled.div`
  font-size: 0.7em;
  //font-weight: bold;
`;

const Value = styled.div`
  font-size: 1.2em;
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
