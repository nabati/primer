import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useNavigate } from "react-router-dom";

export type NavigationItemProps = {
  text: string;
  icon: React.ReactNode;
  to?: string;
  onClick?: () => void;
};

const NavigationItem: React.FC<NavigationItemProps> = ({
  text,
  icon,
  to,
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick !== undefined) {
      onClick();
      return;
    }

    if (to !== undefined) {
      navigate(to);
      return;
    }
  };

  return (
    <ListItem key={text} disablePadding>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavigationItem;
