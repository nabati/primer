import React from "react";
import usePriorities from "../hooks/usePriorities.ts";
import AddPriorityCard from "./AddPriorityCard.tsx";
import { CircularProgress } from "@mui/material";
import PrioritiesTabs from "./PrioritiesTabs.tsx";

type PrioritiesProps = {};

const Priorities: React.FC<PrioritiesProps> = () => {
  const { data: priorities = [], isLoading } = usePriorities();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div>Priorities</div>
      <AddPriorityCard />
      <hr />

      <PrioritiesTabs priorities={priorities} />
    </div>
  );
};

export default Priorities;
