import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import YTDCell from "./YTDCell.tsx";
import StreakCell from "./StreakCell.tsx";

type SummaryTableProps = {
  habitId: string;
};

const SummaryTable: React.FC<SummaryTableProps> = ({ habitId }) => {
  return (
    <TableContainer component={Box}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>
              <b>Current Streak</b>
            </TableCell>
            <TableCell>
              <StreakCell habitId={habitId} />
            </TableCell>
            <TableCell>
              <b>Sum YTD</b>
            </TableCell>
            <TableCell>
              <YTDCell habitId={habitId} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SummaryTable;
