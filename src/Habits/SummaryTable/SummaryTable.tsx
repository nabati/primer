import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import YTDCell from "./YTDCell.tsx";
import StreakCell from "./StreakCell.tsx";

type SummaryTableProps = {
  habitId: string;
};

const SummaryTable: React.FC<SummaryTableProps> = ({ habitId }) => {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <b>Current Streak</b>
              </TableCell>
              <TableCell>
                <StreakCell habitId={habitId} />
              </TableCell>
            </TableRow>
            <TableRow>
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
    </div>
  );
};

export default SummaryTable;
