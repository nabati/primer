import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useNavigate } from "react-router-dom";

export type NavigationItemProps = {
  text: string;
  icon: React.ReactNode;
  to: string;
};

const NavigationItem: React.FC<NavigationItemProps> = ({ text, icon, to }) => {
  const navigate = useNavigate();
  return (
    <ListItem key={text} disablePadding>
      <ListItemButton onClick={() => navigate(to)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavigationItem;
