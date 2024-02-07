import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectPts, selectSolenoids} from "../redux/rocketSlice";
import styles from "./CombinedPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
import RocketSwitch from "../rocket_switch/RocketSwitch";

export function CombinedPage() {
    const pts = useSelector(selectPts);
    const solenoids = useSelector(selectSolenoids);
    const dispatch = useDispatch();
    console.log(pts.Gn2);
    return (
        <div>
            <div className={styles.toprow}>
                <RocketGauge
                    value={pts.Gn2}
                    name={"GN2"}
                    units={" psi"}
                />
                <RocketGauge
                    value={pts.Lox}
                    name={"LOX"}
                    units={" °C"}
                />
                <RocketGauge
                    value={pts.Lng}
                    name={"LNG"}
                    units={" °C"}
                />
                <RocketGauge
                    value={pts.temperatureGn2}
                    name={"GN2"}
                    units={" °C"}
                />
                <RocketGauge
                    value={pts.Gn2}
                    name={"GN2"}
                    units={" psi"}
                />
                <RocketGauge
                    value={pts.Lox}
                    name={"LOX"}
                    units={" psi"}
                />
                <RocketGauge
                    value={pts.Gn2}
                    name={"LNG"}
                    units={" psi"}
                />
            </div>

            <div className={styles.secondrow}>
                <div className={styles.secondleft}>
                    <RocketSwitch
                        current_value={solenoids.feedback_StateGn2Vent}
                        name="GN2 Vent"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        name="LOX Vent"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        name="LNG Vent"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        name="Mvas Vent"
                        className="switches"
                    ></RocketSwitch>
                </div>
                <div className={styles.secondright}>
                    <RocketSwitch
                        name="GN2 Vent"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        name="Vent"
                        className="switches"
                    ></RocketSwitch>
                </div>
            </div>

            <div className={styles.middle}>
                <div className={styles.middleHeader}>
                    <h3>Battery</h3>
                    <h4>Supply Battery</h4>
                </div>
                <button>23.9V</button>
                <button>24.0V</button>
            </div>

            <div className={styles.thirdrow}>
                <div className={styles.thirdleft}>
                    <RocketSwitch
                        name="GN2 Fill"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        name="LOX Fill"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        name="LNG Fill"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        name="Mvas Fill"
                        className="switches"
                    ></RocketSwitch>
                </div>
                <div className={styles.thirdright}>
                    <RocketSwitch
                        name="PV1"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        name="PV2"
                        className="switches"
                    ></RocketSwitch>
                </div>
            </div>
        </div>
    );
}
