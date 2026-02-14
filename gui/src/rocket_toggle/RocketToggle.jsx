import {StatusIndicator} from "@zendeskgarden/react-avatars";
import React, {useContext, useState}  from "react";
import { RocketState } from "../Context.js";
import styles from "./AbortButton.module.css";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RocketToggle = ({
    name,
    className = "",
    expected_value,
    feedback_value,
    
    onClick = () => {},
    enabled,
    switch_type = "mvas",
    isNormallyOpen = false,
    imgConfig = {         
    upGreen: "/toggleupgreen.png",
    upRed: "/toggleupred.png",
    downGreen: "/toggledowngreen.png",
    downRed: "/toggledownred.png",
  },
}) => {
    const isOpen = (feedback_value) => {
        return isNormallyOpen ? feedback_value === 0 : !(feedback_value === 0);
    };
    const [isErrored, setIsErrored] = useState(false);
    const [imgSrc, setImgSource] = useState("/toggleupgreen.png");

    const {isAborted, handleToggleState, handleAbort} = useContext(RocketState);
    const handleClick = async (event) => {
        if (!enabled || !onClick) return;

        // Visual: toggle down
        setImgSource(isErrored ? imgConfig.downRed : imgConfig.downGreen);


        const error = await onClick(event); //  parent control logic
        setIsErrored(error);
        console.log(error)

        // Visual: toggle up
        setImgSource(!error ? imgConfig.upGreen : imgConfig.upRed);
    };
    return (
        <div className={styles.rocketSwitchParts}>
            <div className={styles.components}>
                <h2>{name}</h2>
                <div className={styles.switchRow}>
                    {switch_type === "mvas" ? (
                            <img
                                src = {imgSrc}
                                onClick={handleClick}
                                style={{ width:200}}
                                alt=""
                            />
                    ) : (
                        <div style={{width: 68, overflow: "visible"}}>
                            <img
                                className={styles.flame}
                                src={feedback_value ? "/flame.gif" : "/flame_off.png"}
                                alt="dynamic gif"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default RocketToggle;

// onClick={() => handleToggleSolenoid(name, value)}
