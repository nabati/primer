import React from "react";
import AddPriorityCard from "./AddPriorityCard.tsx";
import ListPriorities from "./ListPriorities.tsx";

type PrioritiesProps = {};

const Priorities: React.FC<PrioritiesProps> = () => (
  <div>
    <div>Priorities</div>
    <AddPriorityCard />
    <hr />

    <ListPriorities />
  </div>
);

export default Priorities;
