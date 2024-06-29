import styled from "styled-components";

const IndentationContainer = styled.div<{ $indentation: number }>`
  padding-left: ${(props) => props.$indentation * 16}px;
`;

export default IndentationContainer;
