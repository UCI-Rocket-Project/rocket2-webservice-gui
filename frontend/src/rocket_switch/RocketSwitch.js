import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectSolenoids, setRocketSolenoid, toggleSolenoid} from "../redux/rocketSlice";
import { StatusIndicator } from '@zendeskgarden/react-avatars'
import { styled } from '@mui/material/styles';
import { MuiSwitch } from './MuiSwitch.js';
import styles from "./RocketSwitch.module.css";
import PropTypes from "prop-types";


const RocketSwitch= ({name, expected_value, current_value}) => {
    const solenoids = useSelector(selectSolenoids);
    const dispatch = useDispatch();

    const handleToggleSolenoid = (solenoidName, value) => {
        dispatch(setRocketSolenoid({solenoidName: solenoidName, solenoidState: value}));
    };

    return (
        <div className={styles.rocketSwitchParts}>
                <h2>{name}</h2>
                <div className={styles.components}>
                    <div className={styles.status}>
                        <StatusIndicator type="offline" aria-label="status: offline" className="status-one">Open</StatusIndicator>
                        <StatusIndicator type="available" aria-label="status: available">Close</StatusIndicator>
                    </div>
                    <MuiSwitch className={styles.rocketSwitch} 
                    onClick={() => handleToggleSolenoid(name, !expected_value)}></MuiSwitch>
                                            

                </div>
            </div>
    );
};

RocketSwitch.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired
};

export default RocketSwitch;

// onClick={() => handleToggleSolenoid(name, value)}