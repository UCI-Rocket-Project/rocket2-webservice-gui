import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectSolenoids, setRocketSolenoid, toggleSolenoid} from "../redux/rocketSlice";
import styles from "./SolenoidPage.module.css";

export function SolenoidPage() {
    const solenoids = useSelector(selectSolenoids);
    const dispatch = useDispatch();

    const handleToggleSolenoid = (solenoidName, value) => {
        dispatch(setRocketSolenoid({solenoidName: solenoidName, solenoidState: value}));
    };

    return (
        <div>
            <h2>Solenoids:</h2>
            <div>
                {Object.entries(solenoids).map(([solenoidName, solenoidState]) => (
                    <button
                        key={solenoidName}
                        onClick={() => handleToggleSolenoid(solenoidName, !solenoidState)}
                    >
                        {solenoidName} {solenoidState ? "ON" : "OFF"}
                    </button>
                ))}
            </div>
        </div>
    );
}
