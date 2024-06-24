import { Box, Stack, Tab, Tabs } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddPriorityCard from "./AddPriorityCard.tsx";
import TabPanel from "./TabPanel.tsx";
import ViewPriority from "./Priority/ViewPriority.tsx";
import { AddCircleOutline } from "@mui/icons-material";

type PrioritiesTabsProps = {
  priorities: Priority[];
};

const ADD_PRIORITY_PANEL_VALUE = "add-priority";

const useArrowsForCyclingThroughPriorities = ({
  priorities,
  value,
  navigate,
}: {
  priorities: Priority[];
  value: string;
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.altKey && event.key === "ArrowRight") {
        const currentIndex = priorities.findIndex(
          (priority) => priority.id === value,
        );
        const nextIndex = currentIndex + 1;
        if (nextIndex < priorities.length) {
          navigate(`/priorities/${priorities[nextIndex].id}`);
        }
        return;
      }

      if (event.altKey && event.key === "ArrowLeft") {
        const currentIndex = priorities.findIndex(
          (priority) => priority.id === value,
        );
        const previousIndex = currentIndex - 1;
        if (previousIndex >= 0) {
          navigate(`/priorities/${priorities[previousIndex].id}`);
        }
      }
      return;
    },
    [navigate, priorities, value],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};

const PrioritiesTabs: React.FC<PrioritiesTabsProps> = ({ priorities }) => {
  const { id: urlPriorityId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(`/priorities/${newValue}`);
  };

  useEffect(() => {
    if (urlPriorityId === undefined && priorities.length > 0) {
      navigate(`/priorities/${priorities[0].id}`);
    }
  }, [navigate, priorities, urlPriorityId]);

  useArrowsForCyclingThroughPriorities({
    priorities,
    value: urlPriorityId ?? ADD_PRIORITY_PANEL_VALUE,
    navigate,
  });

  const value = urlPriorityId ?? ADD_PRIORITY_PANEL_VALUE;

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs value={value} onChange={handleTabChange} variant="scrollable">
        {priorities.map((priority) => (
          <Tab key={priority.id} label={priority.title} value={priority.id} />
        ))}
        <Tab
          label={
            <Stack direction={"row"} alignItems="center" gap={0.5}>
              <AddCircleOutline />
              Add priority
            </Stack>
          }
          value={ADD_PRIORITY_PANEL_VALUE}
        />
      </Tabs>

      {priorities.map((priority) => (
        <TabPanel key={priority.id} value={value} index={priority.id}>
          <ViewPriority id={priority.id} />
        </TabPanel>
      ))}

      <TabPanel value={value} index={ADD_PRIORITY_PANEL_VALUE}>
        <AddPriorityCard />
      </TabPanel>
    </Box>
  );
};

export default PrioritiesTabs;
