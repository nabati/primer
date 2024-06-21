import React from "react";
import styled from "styled-components";
import { format } from "date-fns";

type CellProps = {
  date: Date;
  value: number | undefined;
  streak: number | undefined;
};

const MAX_INTENSITY = 95;
const MIN_INTENSITY = 25;

const mapStreakToIntensity = (streak: number | undefined): number => {
  if (streak === undefined) {
    return 100;
  }

  return Math.max(MIN_INTENSITY, MAX_INTENSITY - streak * 10);
};

const Cell: React.FC<CellProps> = ({ date, value, streak }) => (
  <Container intensity={mapStreakToIntensity(streak)}>
    <DateC>{format(date, "dd/MM")}</DateC> <br /> <Value>{value}</Value>
  </Container>
);

const DateC = styled.div`
  font-size: 0.8em;
  font-weight: bold;
`;

const Value = styled.div`
  font-size: 1.5em;
`;

const Container = styled.div<{ intensity: number }>`
  width: 10em;
  height: 10em;
  overflow: hidden;
  background-color: ${(props) => `hsl(135, 100%, ${props.intensity}%)`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default Cell;
