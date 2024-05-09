import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "../supabaseClient.ts";

type ListProps = {};

const List: React.FC<ListProps> = ({ ...props }) => {
  const { data: prompts } = useQuery({
    queryKey: ["cards"],
    queryFn: async (): Promise<any[]> => {
      const { data: cards } = await getSupabaseClient()
        .from("prompts")
        .select("*");

      if (cards === null) {
        return [];
      }

      return cards;
    },
    initialData: [],
  });

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Content</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prompts?.map((prompt) => (
            <TableRow key={prompt.id}>
              <TableCell>{prompt.content}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
