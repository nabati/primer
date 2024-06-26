import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "../supabaseClient.ts";
import { Prompt } from "../types.ts";
import ListRow from "./ListRow.tsx";
import Create from "../Create.tsx";

const List: React.FC = () => {
  const { data: prompts } = useQuery({
    queryKey: ["cards"],
    queryFn: async (): Promise<Prompt[]> => {
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
