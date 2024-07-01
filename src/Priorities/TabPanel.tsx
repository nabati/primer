import React from "react";

import { Box } from "@mui/material";

type TabPanelProps = {
  value: string;
  index: string;
  children: React.ReactNode;
};

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
