import React, {useContext} from "react";
import styles from "./TelemetryPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
import BatteryG from "../battery_gauge/BatteryGauge";
import RocketSim from "../rocket_sim/RocketSim";
import {RocketState} from "../Context";

export function TelemetryPage() {
    const {flight, misc} = useContext(RocketState);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 20,
                margin: "20px 20px 0px 20px"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                }}
            >
                <RocketGauge
                    value={flight.altitude}
                    minValue={0}
                    maxValue={25000}
                    name={"Altitude"}
                    units={" ft"}
                    arc={{
                        colorArray: ["#EA4228", "#FFAC1C", "#5BE12C"],
                        subArcs: [{limit: 12000}, {limit: 14000}, {}],
                        padding: 0.02,
                        width: 0.3
                    }}
                />
                <RocketGauge
                    value={flight.ecefVelocityY}
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
                    value={flight.accelerationY}
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
                    <div className={styles.battery}>
                        Battery Voltage
                        <BatteryG
                            val={misc.supplyVoltage}
                            width={300}
                            height={100}
                        />
                    </div>
                    <div className={styles.battery}>
                        Supply Voltage
                        <BatteryG
                            val={misc.batteryVoltage}
                            width={300}
                            height={100}
                        />
                    </div>
                </div>
            </div>

            <RocketSim color={"#ff0000"}></RocketSim>
        </div>
    );
}
