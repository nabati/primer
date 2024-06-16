import React from "react";
import AddPriorityCard from "./AddPriorityCard.tsx";

type PrioritiesProps = {};

const Priorities: React.FC<PrioritiesProps> = () => (
  <div>
    <div>Priorities</div>
    <AddPriorityCard />
  </div>
);

export default Priorities;
