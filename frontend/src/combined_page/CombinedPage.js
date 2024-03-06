import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectPts, selectSolenoids, selectTcs} from "../redux/rocketSlice";
import styles from "./CombinedPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
import RocketSwitch from "../rocket_switch/RocketSwitch";

export function CombinedPage() {
    const pts = useSelector(selectPts);
    const solenoids = useSelector(selectSolenoids);
    const tcs = useSelector(selectTcs);
    // const dispatch = useDispatch();

    return Object.keys(solenoids).length != 0 ? (
        <div className={styles.everything}>
            {/* page titles */}
            <div className={styles.titles}>
                <h1 className={styles.GSEtitle}>GSE</h1>
                <h1 className={styles.ECUtitle}>ECU</h1>
            </div>

            {/* all GSE */}
            <div className={styles.GSEColor}>
                {/* GSE gauges */}
                <div className={styles.toprow}>
                    <div className={styles.GSEgaugeGn2}>
                    <RocketGauge
                        value={pts.Gn2}
                        units={" psi"}
                        name={"GN2"}
                        width={"75%"}
                    />
                    </div>
                    <div className={styles.GSEgaugeLox}>
                    <RocketGauge
                        value={tcs.Lox}
                        name={"LOX"}
                        units={" °C"}
                        width={"75%"}
                    />
                    </div>
                    <div className={styles.GSEgaugeLng}>
                    <RocketGauge
                        value={tcs.Lng}
                        name={"LNG"}
                        units={" °C"}
                        width={"75%"}
                    />
                    </div>
                </div>

                {/* GSE top row switches */}
                <div className={styles.secondleft}>
                    <RocketSwitch
                        title="Gn2Vent"
                        name="Gn2Vent"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        title="LOX Vent"
                        name="LOX Vent"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        title="LNG Vent"
                        name="LNG Vent"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        title="Mvas Vent"
                        name="Mvas Vent"
                        className="switches"
                    ></RocketSwitch>
                </div> 

                {/* GSE bottom row swtiches */}
                <div className={styles.thirdleft}>
                    <RocketSwitch
                        title="GN2 Fill"
                        name="GN2 Fill"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        title = "LOX Fill"
                        name="LOX Fill"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        title="LNG Fill"
                        name="LNG Fill"
                        className="switches"
                    ></RocketSwitch>
                    <RocketSwitch
                        title="Mvas Fill"
                        name="Mvas Fill"
                        className="switches"
                    ></RocketSwitch>
                </div>
            </div>

            {/* all ECU */}    
            <div className={styles.ECUColor}>
                {/* ECU switches + battery column */}
                <div className={styles.together}>
                    {/* ECU top row swtiches */}
                    <div className={styles.secondright}>
                        <RocketSwitch
                            title="GN2 Vent"
                            name={solenoids.CurrentGn2Vent}
                            className="switches"
                            feedback_value={solenoids.CurrentGn2Vent}
                        />
                        <RocketSwitch
                            title="Vent"
                            name={solenoids.CurrentVent}
                            className="switches"
                            feedback_value={solenoids.CurrentGn2Vent}
                        />
                    </div>
            
                    {/* ECU top bottom swtiches */}
                    <div className={styles.thirdright}>
                        <RocketSwitch
                            title="PV1"
                            name={solenoids.CurrentPv1}
                            className="switches"
                        />
                        <RocketSwitch
                            title="PV2"
                            name={solenoids.CurrentPv2}
                            className="switches"
                        />
                    </div>

                    {/* battery */}
                    <div className={styles.middle}>
                        {/* battery headers */}
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

                {/* ECU gauges */}
                <div className={styles.rightColumn}>
                    <div className={styles.ECUgaugeGn2}>
                    <RocketGauge
                        value={tcs.Gn2}
                        name={"GN2"}
                        units={" °C"}
                        width={"75%"}
                    />
                    </div>
                    <div className={styles.ECUgaugeGn2Two}>
                    <RocketGauge
                        value={pts.Gn2}
                        name={"GN2"}
                        units={" psi"}
                        width={"75%"}
                    />
                    </div>
                    <div className={styles.ECUgaugeLox}>
                    <RocketGauge
                        value={pts.Lox}
                        name={"LOX"}
                        units={" psi"}
                        width={"75%"}
                    />
                    </div>
                    <div className={styles.ECUgaugeGn2Three}>
                    <RocketGauge
                        value={pts.Gn2}
                        name={"LNG"}
                        units={" psi"}
                        width={"75%"}
                    />
                    </div>
                </div>
            </div>
        </div>
    ) : <></>;
}
