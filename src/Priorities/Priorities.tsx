import React from "react";
import useListPriorities from "../hooks/useListPriorities.ts";
import PrioritiesTabs from "./PrioritiesTabs.tsx";
import CircularProgress from "@mui/material/CircularProgress";

type PrioritiesProps = {};

const Priorities: React.FC<PrioritiesProps> = () => {
  const { data: priorities = [], isLoading } = useListPriorities();

  if (isLoading) {
    return <CircularProgress />;
  }

  return <PrioritiesTabs priorities={priorities} />;
};

export default Priorities;
