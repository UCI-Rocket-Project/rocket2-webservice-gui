import React from "react";
import {StatusIndicator} from "@zendeskgarden/react-avatars";
import {MuiSwitch} from "./MuiSwitch.js";
import styles from "./RocketSwitch.module.css";
import PropTypes from "prop-types";

const RocketSwitch = ({name, expected_value, feedback_value, onClick = () => {}, enabled, switch_type = "solenoid", isNormallyOpen = false}) => {
    const isOpen = (feedback_value) => {
        return isNormallyOpen ? feedback_value === 0 : !(feedback_value === 0);
    };

    return (
        <div className={styles.rocketSwitchParts}>
            <div className={styles.components}>
                <h2>{name}</h2>
                <div className={styles.switchRow}>
                    {switch_type === "solenoid" ? (
                        <div className={styles.status}>
                            <StatusIndicator
                                type={isOpen(feedback_value) ? "available" : "offline"}
                                className="status-one"
                                data-testid={"status " + name}
                                aria-label="IsOpen"
                            >
                                Open
                            </StatusIndicator>
                            <StatusIndicator
                                type={isOpen(feedback_value) ? "offline" : "available"}
                                aria-label="IsClosed"
                            >
                                Close
                            </StatusIndicator>
                        </div>
                    ) : (
                        <div>
                            <img
                                className={styles.flame}
                                src={feedback_value ? "/flame.gif" : "/flame_off.png"}
                                alt="dynamic gif"
                            />
                        </div>
                    )}
                    <MuiSwitch
                        checked={isNormallyOpen ? expected_value !== 1 : expected_value === 1}
                        disabled={expected_value === -1 || enabled === false}
                        className={styles.rocketSwitch}
                        onChange={(event) => onClick(isNormallyOpen ? !event.target.checked : event.target.checked)}
                        data-testid={"switch " + name}
                    ></MuiSwitch>
                </div>
            </div>
        </div>
    );
};

RocketSwitch.propTypes = {
    name: PropTypes.string.isRequired
};

export default RocketSwitch;

// onClick={() => handleToggleSolenoid(name, value)}
