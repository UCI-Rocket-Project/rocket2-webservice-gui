import React from "react";
import PropTypes from "prop-types";
import Switch from '@mui/material/Switch';
import styles from "./RocketSwitch.module.css";
import { StatusIndicator } from '@zendeskgarden/react-avatars';

const RocketSwitch = ({name, expected_status, actual_status}) => {
    return (
        <div className={styles.together}>
            <label className={styles.names}>{name}</label>
                <Switch
                    onChange={(event) => handleToggleSolenoid(name, expected_status)}
                    checked={expected_status}
                    color="primary" // Adjust color as needed
                    className = {styles.switches}
                ></Switch>
                        
                    
                <div className={styles.statuses}>
                    <StatusIndicator type="offline" aria-label="status: offline"> On </StatusIndicator>
                    <StatusIndicator type="available" aria-label="status: available"> Off </StatusIndicator>
                </div>
        </div>
    );
};

RocketSwitch.propTypes = {
    name: PropTypes.string.isRequired,
    expected_status: PropTypes.string.isRequired,
    actual_status: PropTypes.string.isRequired
};

export default RocketSwitch;