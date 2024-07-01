import React from "react";
import useListPriorities from "../hooks/useListPriorities.ts";
import PrioritiesTabs from "./PrioritiesTabs.tsx";
import CircularProgress from "@mui/material/CircularProgress";

const Priorities: React.FC = () => {
  const { data: priorities = [], isLoading } = useListPriorities();

  if (isLoading) {
    return <CircularProgress />;
  }

  return <PrioritiesTabs priorities={priorities} />;
};

export default Priorities;
