import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import TabPanel from "./TabPanel.tsx";
import ViewPriority from "./Priority/ViewPriority.tsx";

type PrioritiesTabsProps = {
  priorities: Priority[];
};

const PrioritiesTabs: React.FC<PrioritiesTabsProps> = ({ priorities }) => {
  const [value, setValue] = React.useState(priorities[0].id);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleTabChange} variant="scrollable">
          {priorities.map((priority) => (
            <Tab label={priority.title} value={priority.id} />
          ))}
        </Tabs>

        {priorities.map((priority) => (
          <TabPanel value={value} index={priority.id}>
            <ViewPriority id={priority.id} />
          </TabPanel>
        ))}
      </Box>
    </div>
  );
};

export default PrioritiesTabs;
