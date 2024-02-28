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
            <div className={styles.titles}>
                <h1 className={styles.GSEtitle}>GSE</h1>
                <h1 className={styles.ECUtitle}>ECU</h1>
            </div>

            <div className={styles.GSEColor}>
            <div className={styles.toprow}>
                <RocketGauge
                    value={pts.Gn2}
                    units={" psi"}
                    name={"GN2"}
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
            </div>
            <div className={styles.secondleft}>
                    <RocketSwitch
                        expected_value={solenoids["solenoid_expected_CurrentGn2Vent"]}
                        feedback_value={solenoids["solenoid_feedback_CurrentGn2Vent"]}
                        name="Gn2Vent"
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
                </div>
                
                <div className={styles.ECUColor}>
                <div className={styles.together}>
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

                <div className={styles.middle}>
                <div className={styles.middleHeader}>
                    <h3>Battery</h3>
                    <div className="styles.supplyBattery">
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
            
            <div className={styles.rightColumn}>
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
            </div>
        </div>
    );
}
