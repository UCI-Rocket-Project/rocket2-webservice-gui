import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectSolenoids, setRocketSolenoid, toggleSolenoid} from "../redux/rocketSlice";
import { StatusIndicator } from '@zendeskgarden/react-avatars'
import { styled } from '@mui/material/styles';
import { MuiSwitch } from './MuiSwitch.js';
import styles from "./RocketSwitch.module.css";
import PropTypes from "prop-types";


const RocketSwitch= ({name, expected_value, feedback_value}) => {
    const solenoids = useSelector(selectSolenoids);
    const dispatch = useDispatch();

    const handleToggleSolenoid = (solenoidName, value) => {
        dispatch(setRocketSolenoid({solenoidName: solenoidName, solenoidState: value}));
    };

    const getStatusType1 = (feedbackValue) => {
        return feedbackValue === 0 ? 'offline' : 'available';
    };

    const getStatusType2 = (feedbackValue) => {
        return feedbackValue === 0 ? 'available': 'offline';
    };

    return (
        <div className={styles.rocketSwitchParts}>
                <div className={styles.components}>
                    <h2>{name}</h2>
                    <p className={styles.on}>On</p>
                    <div className={styles.status}>
                        <StatusIndicator type={getStatusType1(feedback_value)} aria-label="status: offline" className="status-one">Open</StatusIndicator>
                        <StatusIndicator type={getStatusType2(feedback_value)} aria-label="status: available">Close</StatusIndicator>
                    </div>
                    <MuiSwitch className={styles.rocketSwitch} 
                    onClick={() => handleToggleSolenoid(name, !expected_value)}></MuiSwitch>
                    <p className={styles.off}>Off</p>
                    

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