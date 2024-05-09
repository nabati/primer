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
import ListRow from "./ListRow.tsx";
import Create from "../Create.tsx";

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
            <TableCell>
              <Create />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {prompts?.map((prompt) => (
            <ListRow
              key={prompt.id}
              id={prompt.id}
              content={prompt.content}
              lastReviewed={prompt.lastReviewed}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
