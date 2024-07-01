import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import useListPriorities from "../hooks/useListPriorities.ts";
import { CircularProgress, Link } from "@mui/material";

const truncateDescription = (description: string, maxWords: number) => {
  const words = description.split(" ");
  if (words.length <= maxWords) return description;
  return words.slice(0, maxWords).join(" ") + "...";
};

const ListPriorities: React.FC = () => {
  const { data: priorities = [], isLoading } = useListPriorities();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {priorities.map((priority) => (
            <TableRow key={priority.id}>
              <TableCell>
                <Link href={`/priorities/${priority.id}`} underline="hover">
                  {priority.title}
                </Link>
              </TableCell>
              <TableCell>
                {truncateDescription(priority.description, 20)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListPriorities;
