import Box from "@mui/material/Box";
import React from "react";
import styled from "styled-components";
import getFirstNCharactersWholeWords from "../utils/getFirstNCharactersWholeWords.ts";
import getFormattedDate from "../utils/getFormattedDate.ts";

type JournalListCardProps = {
  entry: {
    id: string;
    content: string;
    created_at: Date;
  };
  onClick: () => void;
};

const JournalListCard: React.FC<JournalListCardProps> = ({
  entry,
  onClick,
}) => (
  <StyledBox onClick={onClick}>
    <i>{getFormattedDate(entry.created_at)}</i>
    <p>{getFirstNCharactersWholeWords(entry.content, 100)}</p>
  </StyledBox>
);

const StyledBox = styled(Box)`
  cursor: pointer;
`;

export default JournalListCard;
