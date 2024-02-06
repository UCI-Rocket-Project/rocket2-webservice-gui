import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectPts} from "../redux/rocketSlice";
import styles from "./TelemetryPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
import RocketSim from "../rocket_sim/RocketSim";
export function TelemetryPage() {
    const pts = useSelector(selectPts);
    const dispatch = useDispatch();

    return (
        <div>
            <h2>Pts:</h2>
            <RocketSim color={"#ff0000"}></RocketSim>
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
