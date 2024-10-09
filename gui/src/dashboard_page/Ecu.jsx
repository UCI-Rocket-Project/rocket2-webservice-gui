import {useContext} from "react";
import styles from "./DashboardPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
import RocketSwitch from "../rocket_switch/RocketSwitch";
import {RocketState} from "../Context";

export function Ecu({toggleKey, keydown}) {
    const {solenoids, tcs, pts, igniters, handleToggleState} = useContext(RocketState);

    return (
        <div className={styles.ecuBox}>
            <div className={styles.boundingBox}>
                <h2 data-testid="ecuPanel">ECU</h2>
                <div className={styles.ecuGaugeRow}>
                    <RocketGauge
                        value={tcs.Copv}
                        minValue={15}
                        maxValue={75}
                        name={"COPV TC"}
                        units={" °C"}
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 50}, {limit: 65}, {limit: 75}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                    <RocketGauge
                        value={pts.Copv}
                        minValue={0}
                        maxValue={6000}
                        name={"COPV PT"}
                        units={" psi"}
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 4000}, {limit: 5000}, {limit: 6000}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                    <RocketGauge
                        value={pts.Lox}
                        minValue={0}
                        maxValue={6000}
                        name={"LOX PT"}
                        units={" psi"}
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 4000}, {limit: 5000}, {limit: 6000}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.ecuSwitchColumn}>
                        <div className={styles.switchRow}>
                            <RocketSwitch
                                name="COPV Vent"
                                className="switches"
                                expected_value={solenoids["CopvVent"]["expected"]}
                                feedback_value={solenoids["CopvVent"]["current"]}
                                onClick={(event) => handleToggleState("ecu", "CopvVent", event)}
                                enabled={keydown === toggleKey}
                            />
                            <RocketSwitch
                                name="Vent"
                                className="switches"
                                expected_value={solenoids["Vent"]["expected"]}
                                feedback_value={solenoids["Vent"]["current"]}
                                onClick={(event) => handleToggleState("ecu", "Vent", event)}
                                enabled={keydown === toggleKey}
                                isNormallyOpen={true}
                            />
                        </div>
                        <div className={styles.switchRow}>
                            <RocketSwitch
                                name="PV1"
                                className="switches"
                                expected_value={solenoids["Pv1"]["expected"]}
                                feedback_value={solenoids["Pv1"]["current"]}
                                onClick={(event) => handleToggleState("ecu", "Pv1", event)}
                                enabled={keydown === toggleKey}
                            />
                            <RocketSwitch
                                name="PV2"
                                className="switches"
                                expected_value={solenoids["Pv2"]["expected"]}
                                feedback_value={solenoids["Pv2"]["current"]}
                                onClick={(event) => handleToggleState("ecu", "Pv2", event)}
                                enabled={keydown === toggleKey}
                                isNormallyOpen={true}
                            />
                        </div>
                        {/* battery */}
                        <div className={styles.switchRow}>
                            <div className={styles.battery}>
                                {/* battery headers */}
                                <div className={styles.middleHeader}>
                                    <h3>Battery</h3>
                                    <div className={styles.supplyBattery}>
                                        <h4>Supply</h4>
                                        <h4>Battery</h4>
                                    </div>
                                </div>

                                <div className={styles.batteryButtons}>
                                    <button>23.9V</button>
                                    <button>24.0V</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ECU gauges */}
                    <div>
                        <RocketGauge
                            value={pts.Lng}
                            minValue={0}
                            maxValue={6000}
                            name={"LNG PT"}
                            units={" psi"}
                            arc={{
                                colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                                subArcs: [{limit: 4000}, {limit: 5000}, {limit: 6000}],
                                padding: 0.02,
                                width: 0.3
                            }}
                        />
                        <RocketGauge
                            value={pts.InjectorLox}
                            minValue={0}
                            maxValue={6000}
                            name={"LOX INJ PT"}
                            units={" psi"}
                            arc={{
                                colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                                subArcs: [{limit: 4000}, {limit: 5000}, {limit: 6000}],
                                padding: 0.02,
                                width: 0.3
                            }}
                        />
                        <RocketGauge
                            value={pts.InjectorLng}
                            minValue={0}
                            maxValue={6000}
                            name={"LNG INJ PT"}
                            units={" psi"}
                            arc={{
                                colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                                subArcs: [{limit: 4000}, {limit: 5000}, {limit: 6000}],
                                padding: 0.02,
                                width: 0.3
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
