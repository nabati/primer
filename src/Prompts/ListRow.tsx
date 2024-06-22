import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React from "react";

type ListRowProps = {
  id: string;
  content: string;
  lastReviewed: any;
};

const ListRow: React.FC<ListRowProps> = ({ id, content, lastReviewed }) => {
  return (
    <TableRow key={id}>
      <TableCell>{content}</TableCell>
      <TableCell>{lastReviewed}</TableCell>
    </TableRow>
  );
};

export default ListRow;
