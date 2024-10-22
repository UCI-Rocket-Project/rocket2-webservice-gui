import React, {useContext, useEffect, useState} from "react";
import styles from "./TelemetryPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
import RocketSim from "../rocket_sim/RocketSim";
import {RocketState} from "../Context";


export function TelemetryPage() {

    const {flight}=
    useContext(RocketState);

    return (
        <div className={styles.parent}>
            <div className={styles.container}>
                TELEMETRY PAGE
            </div>
            <div className={styles.container}>
                <div className={styles.GaugeCol}>
                    <RocketGauge
                        value={flight.altitude}
                        minValue={0}
                        maxValue={15000}
                        name={"Altitude"}
                        units={" ft"}
                        arc={{
                            colorArray: ["#5BE12C", "#EA4228"],
                            subArcs: [{ limit: 100 }, { limit: 300 }, {}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                    <RocketGauge
                        value={1000}
                        minValue={0}
                        maxValue={500}
                        name={"Speed"}
                        units={" mph"}
                        arc={{
                            colorArray: ["#5BE12C", "#EA4228"],
                            subArcs: [{ limit: 100 }, { limit: 300 }, {}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                    <RocketGauge
                        value={flight.accelerationY}
                        minValue={0}
                        maxValue={125}
                        name={"Y Acceleration"}
                        units={" ft/s²"}
                        arc={{
                            colorArray: ["#5BE12C", "#EA4228"],
                            subArcs: [{ limit: 30 }, { limit: 60 }, { limit: 80 }],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                </div>
                <div className={styles.GaugeCol}>
                    <div>
                        <RocketSim color={"#ff0000"}></RocketSim>
                    </div>
                </div>
            </div>

        </div>
    );
}



