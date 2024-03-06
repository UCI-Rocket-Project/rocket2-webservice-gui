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
        <div className={styles.container}>
            <RocketGauge
                value={1000}
                minValue={0}
                maxValue={15000}
                name={"Altitude"}
                units={" ft"}
            />
            <RocketGauge
                value={1000}
                minValue={0}
                maxValue={500}
                name={"Speed"}
                units={" mph"}
                arc={{
                    colorArray: ["#5BE12C", "#EA4228"],
                    subArcs: [{limit: 100}, {limit: 300}, {}],
                    padding: 0.02,
                    width: 0.3
                }}
            />
            <RocketGauge
                value={0}
                minValue={0}
                maxValue={125}
                name={"Y Acceleration"}
                units={" ft/s²"}
                arc={{
                    colorArray: ["#5BE12C", "#EA4228"],
                    subArcs: [{limit: 30}, {limit: 60}, {limit: 80}],
                    padding: 0.02,
                    width: 0.3
                }}
            />
            <div>
                <RocketSim color={"#ff0000"}></RocketSim>
            </div>
        </div>
    );
}
