import React, {useState} from "react";
import {StatusIndicator} from "@zendeskgarden/react-avatars";
import {MuiSwitch} from "./MuiSwitch.js";
import styles from "./RocketSwitch.module.css";
import PropTypes from "prop-types";

const RocketSwitch = ({name, expected_value, feedback_value, onClick = () => {}, enabled}) => {
    const getStatusType1 = (feedbackValue) => {
        return feedbackValue === 0 ? "offline" : "available";
    };

    const getStatusType2 = (feedbackValue) => {
        return feedbackValue === 0 ? "available" : "offline";
    };

    return (
        <div className={styles.rocketSwitchParts}>
            <div className={styles.components}>
                <h2>{name}</h2>
                <div className={styles.status}>
                    <StatusIndicator
                        type={getStatusType1(feedback_value)}
                        aria-label="status: offline"
                        className="status-one"
                    >
                        Open
                    </StatusIndicator>
                    <StatusIndicator
                        type={getStatusType2(feedback_value)}
                        aria-label="status: available"
                    >
                        Close
                    </StatusIndicator>
                </div>
                <MuiSwitch
                    checked={expected_value == 1 ? true : false}
                    disabled={expected_value == -1 || enabled == false}
                    className={styles.rocketSwitch}
                    onChange={(event) => onClick(event.target.checked)}
                ></MuiSwitch>
            </div>
        </div>
    );
};

RocketSwitch.propTypes = {
    name: PropTypes.string.isRequired
};

export default RocketSwitch;

// onClick={() => handleToggleSolenoid(name, value)}
