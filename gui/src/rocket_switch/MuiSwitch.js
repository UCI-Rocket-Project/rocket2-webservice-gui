import React from "react";
import {StatusIndicator} from "@zendeskgarden/react-avatars";
import {styled} from "@mui/material/styles";
import Switch from "@mui/material/Switch";

export const MuiSwitch = styled(Switch)(({theme}) => ({
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
            color: "#fff",
            "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.mode === "dark" ? "#447444" : "#447444",
                opacity: 1,
                border: 0
            },
            "&.Mui-disabled + .MuiSwitch-track": {
                opacity: 0.5
            }
        }
    },
    "& .MuiSwitch-thumb": {
        width: 32,
        height: 32
    },
    "& .MuiSwitch-track": {
        borderRadius: 20 / 2,
        backgroundColor: theme.palette.mode === "light" ? " #282828" : " #004C00",
        opacity: 1,
        transition: theme.transitions.create(["background-color"], {
            duration: 500
        })
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#447444",
        border: "6px solid #fff"
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600]
    },
    "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3
    }
}));
