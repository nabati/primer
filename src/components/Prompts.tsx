import React from "react";
import List from "../Prompts/List.tsx";
import Stack from "../Stack.tsx";

type PromptsProps = {};

const Prompts: React.FC<PromptsProps> = () => {
  return (
    <div>
      <Stack />
      <List />
    </div>
  );
};

export default Prompts;
