import React from "react";
import styled from "styled-components";

type CellProps = {
  date: Date;
  value: number | undefined;
  streak: number | undefined;
};

const Cell: React.FC<CellProps> = ({ date, value, streak }) => (
  <Container>
    {date.toString()} <br /> {value} <br /> {streak}
  </Container>
);

const Container = styled.div`
  width: 10em;
  height: 10em;
  overflow: hidden;
`;

export default Cell;
