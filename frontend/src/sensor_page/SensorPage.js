import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectPts} from "../redux/rocketSlice";
import styles from "./SensorPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
export function SensorPage() {
    const pts = useSelector(selectPts);
    const dispatch = useDispatch();

    return (
        <div>
            <h2>Pts:</h2>
            <div>
                {Object.entries(pts).map(([name, val]) => (
                    <RocketGauge
                        value={val}
                        name={name}
                    />
                ))}
            </div>
        </div>
    );
}
