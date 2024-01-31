import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectSolenoids, setRocketSolenoid, toggleSolenoid} from "../redux/rocketSlice";
import Switch from '@mui/material/Switch';
import { StatusIndicator } from '@zendeskgarden/react-avatars';
import styles from "./SolenoidPage.module.css";

export function SolenoidPage() {
    const solenoids = useSelector(selectSolenoids);
    const dispatch = useDispatch();

    const handleToggleSolenoid = (solenoidName, value) => {
        dispatch(setRocketSolenoid({solenoidName: solenoidName, solenoidState: value}));
    };

    return (
        <div>
            <h2 className={styles.title}>Solenoids:</h2>
            <div className={styles.subtitles}>
                <h4 className={styles.specific_subtitles}> Solenoid</h4>
                <h4 className={styles.specific_subtitles}> Expected</h4>
                <h4 className={styles.specific_subtitles}> Actual</h4>
            </div>
                {Object.entries(solenoids).map(([solenoidName, solenoidStatus]) => (
                    <div className={styles.together}>
                        <label className={styles.names}>{solenoidName}</label>
                        <Switch
                            onChange={(event) => handleToggleSolenoid(solenoidName, !solenoidStatus["expected"])}
                            checked={solenoidStatus["expected"]}
                            color="primary" // Adjust color as needed
                            className = {styles.switches}
                        ></Switch>
                        
                    
                        <div className={styles.statuses}>
                        <StatusIndicator type="offline" aria-label="status: offline"> On </StatusIndicator>
                        <StatusIndicator type="available" aria-label="status: available"> Off </StatusIndicator>
                        </div>
                    </div>

                    // <button
                    //     key={solenoidName}
                    //     onClick={() => handleToggleSolenoid(solenoidName, !solenoidStatus["expected"])}
                    // >
                    //     {solenoidName} {solenoidStatus["expected"] ? "ON" : "OFF"}
                    // </button>
                ))}
        </div>
    );
}
