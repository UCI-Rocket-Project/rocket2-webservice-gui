import React from "react";
import { StatusIndicator } from '@zendeskgarden/react-avatars'
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

export const MuiSwitch = styled(Switch)(({ theme, }) => ({
    width: 68,
    height: 34,
    padding: 7,
    transform: "rotate(-90deg)",
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        transform: "translateX(30px)",
      },
    },
    "& .MuiSwitch-thumb": {
      width: 32,
      height: 32,
    },
    "& .MuiSwitch-track": {
      borderRadius: 20 / 2,
    },
  }));