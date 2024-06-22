import React from "react";
import usePriorities from "../hooks/usePriorities.ts";
import PrioritiesTabs from "./PrioritiesTabs.tsx";
import CircularProgress from "@mui/material/CircularProgress";

type PrioritiesProps = {};

const Priorities: React.FC<PrioritiesProps> = () => {
  const { data: priorities = [], isLoading } = usePriorities();

  if (isLoading) {
    return <CircularProgress />;
  }

  return <PrioritiesTabs priorities={priorities} />;
};

export default Priorities;
