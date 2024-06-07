import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {selectIgniters, selectKeydown, selectMisc, selectPts, selectSolenoids, selectTcs, selectTimestamp} from "../redux/rocketSlice";
import {setKeydown} from "../redux/rocketSlice";
import {updateRocket} from "../webservice";
import styles from "./DashboardPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
import RocketSwitch from "../rocket_switch/RocketSwitch";

export function DashboardPage() {
    const TOGGLE_KEY = "Control";
    const pts = useSelector(selectPts);
    const solenoids = useSelector(selectSolenoids);
    const igniters = useSelector(selectIgniters);
    const tcs = useSelector(selectTcs);
    const misc = useSelector(selectMisc);
    const timestamp = useSelector(selectTimestamp);
    const dispatch = useDispatch();
    const keydown = useSelector(selectKeydown);
    useEffect(() => {
        const handleKeyDown = (event) => {
            dispatch(setKeydown(event.key));
        };

        const handleKeyUp = () => {
            dispatch(setKeydown(null));
        };

        // Adding event listeners when component mounts
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        // Removing event listeners when component unmounts
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []); // Empty dependency array ensures this effect runs only once
    // systemName: "gse" or "ecu"
    const handleToggleState = (systemName, solenoidName, value) => {
        console.log("toggling state");
        console.log(value);
        updateRocket(systemName, solenoidName, value);
    };
    console.log(igniters);
    return timestamp ? (
        <div className={styles.row}>
            <div className={styles.gseBox}>
                <div className={styles.boundingBox}>
                    <h2
                        className={styles.title}
                        data-testid="gsePanel"
                    >
                        GSE
                    </h2>
                    <div className={styles.gseGaugeRow}>
                        <RocketGauge
                            value={pts.Gn2}
                            minValue={0}
                            maxValue={6000}
                            units={" psi"}
                            name={"GN2 PT"}
                            arc={{
                                colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                                subArcs: [{limit: 4000}, {limit: 5000}, {limit: 6000}],
                                padding: 0.02,
                                width: 0.3
                            }}
                        />
                        <RocketGauge
                            value={tcs.Lox}
                            minValue={-200}
                            maxValue={50}
                            name={"LOX TC"}
                            units={" °C"}
                            arc={{
                                colorArray: ["#5BE12C"],
                                subArcs: [{limit: 50}],
                                padding: 0.02,
                                width: 0.3
                            }}
                        />
                        <RocketGauge
                            value={tcs.Lng}
                            minValue={-200}
                            maxValue={50}
                            name={"LNG TC"}
                            units={" °C"}
                            arc={{
                                colorArray: ["#5BE12C"],
                                subArcs: [{limit: 50}],
                                padding: 0.02,
                                width: 0.3
                            }}
                        />
                    </div>

                    {/* GSE top row switches */}
                    <div className={styles.switchRow}>
                        <RocketSwitch
                            expected_value={solenoids["Gn2Vent"]["expected"]}
                            feedback_value={solenoids["Gn2Vent"]["current"]}
                            onClick={(event) => handleToggleState("gse", "Gn2Vent", event)}
                            name="GN2 Vent"
                            className="switches"
                            enabled={keydown === TOGGLE_KEY}
                        ></RocketSwitch>
                        <RocketSwitch
                            name="LOX Vent"
                            className="switches"
                            expected_value={solenoids["LoxVent"]["expected"]}
                            feedback_value={solenoids["LoxVent"]["current"]}
                            onClick={(event) => handleToggleState("gse", "LoxVent", event)}
                            enabled={keydown === TOGGLE_KEY}
                            isNormallyOpen={true} // figure ito ut
                        ></RocketSwitch>
                        <RocketSwitch
                            name="LNG Vent"
                            className="switches"
                            expected_value={solenoids["LngVent"]["expected"]}
                            feedback_value={solenoids["LngVent"]["current"]}
                            onClick={(event) => handleToggleState("gse", "LngVent", event)}
                            enabled={keydown === TOGGLE_KEY}
                            isNormallyOpen={true} // figure it out
                        ></RocketSwitch>
                        <RocketSwitch
                            name="MVAS Vent"
                            className="switches"
                            expected_value={solenoids["MvasVent"]["expected"]}
                            feedback_value={solenoids["MvasVent"]["current"]}
                            onClick={(event) => handleToggleState("gse", "MvasVent", event)}
                            enabled={keydown === TOGGLE_KEY}
                        ></RocketSwitch>
                    </div>

                    {/* GSE bottom row switches */}
                    <div className={styles.switchRow}>
                        <RocketSwitch
                            name="GN2 Fill"
                            className="switches"
                            expected_value={solenoids["Gn2Fill"]["expected"]}
                            feedback_value={solenoids["Gn2Fill"]["current"]}
                            onClick={(event) => handleToggleState("gse", "Gn2Fill", event)}
                            enabled={keydown === TOGGLE_KEY}
                        ></RocketSwitch>
                        <RocketSwitch
                            name="MVAS Open"
                            className="switches"
                            expected_value={solenoids["MvasOpen"]["expected"]}
                            feedback_value={solenoids["MvasOpen"]["current"]}
                            onClick={(event) => handleToggleState("gse", "MvasOpen", event)}
                            enabled={keydown === TOGGLE_KEY}
                        ></RocketSwitch>
                        <RocketSwitch
                            name="MVAS Close"
                            className="switches"
                            expected_value={solenoids["MvasClose"]["expected"]}
                            feedback_value={solenoids["MvasClose"]["current"]}
                            onClick={(event) => handleToggleState("gse", "MvasClose", event)}
                            enabled={keydown === TOGGLE_KEY}
                        ></RocketSwitch>
                        <RocketSwitch
                            name="MVAS Fill"
                            className="switches"
                            expected_value={solenoids["MvasFill"]["expected"]}
                            feedback_value={solenoids["MvasFill"]["current"]}
                            onClick={(event) => handleToggleState("gse", "MvasFill", event)}
                            enabled={keydown === TOGGLE_KEY}
                        ></RocketSwitch>
                    </div>
                    <div className={styles.launchRow}>
                        <div>
                            <RocketSwitch
                                name="Gn2 Disconnect"
                                className="switches"
                                expected_value={solenoids["Gn2Disconnect"]["expected"]}
                                feedback_value={solenoids["Gn2Disconnect"]["current"]}
                                onClick={(event) => handleToggleState("gse", "Gn2Disconnect", event)}
                                enabled={keydown === TOGGLE_KEY}
                            ></RocketSwitch>
                            <RocketSwitch
                                name="Alarm"
                                className="switches"
                                expected_value={-1}
                                feedback_value={-1}
                                onClick={(event) => handleToggleState("gse", "0", event)}
                                enabled={keydown === TOGGLE_KEY}
                            ></RocketSwitch>
                        </div>
                        <div style={{flex: 2}}></div>
                        <div>
                            <RocketSwitch
                                name="Igniter 1"
                                className="switches"
                                expected_value={igniters["0"]["expected"]}
                                feedback_value={igniters["0"]["current"]}
                                onClick={(event) => handleToggleState("gse", "0", event)}
                                enabled={keydown === TOGGLE_KEY}
                                switch_type="igniter"
                            ></RocketSwitch>
                            <RocketSwitch
                                name="Igniter 2"
                                className="switches"
                                expected_value={igniters["1"]["expected"]}
                                feedback_value={igniters["1"]["current"]}
                                onClick={(event) => handleToggleState("gse", "1", event)}
                                enabled={keydown === TOGGLE_KEY}
                                switch_type="igniter"
                            ></RocketSwitch>
                        </div>
                        <div style={{flex: 1}}></div>
                        <div className={styles.launchRowRight}>
                            {igniters.armed ? (
                                <img
                                    style={{width: "200px", height: "213px"}}
                                    src="/key_armed.png"
                                    alt=""
                                />
                            ) : (
                                <img
                                    style={{width: "200px", height: "213px"}}
                                    src="/key_unarmed.png"
                                    alt=""
                                />
                            )}
                            {keydown === TOGGLE_KEY ? (
                                solenoids["MvasOpen"]["expected"] ? (
                                    <img
                                        onClick={(event) => handleToggleState("gse", "MvasOpen", 0)}
                                        src="/button_on_open.png"
                                        alt=""
                                    />
                                ) : (
                                    <img
                                        onClick={(event) => handleToggleState("gse", "MvasOpen", 1)}
                                        src="/button_off_open.png"
                                        alt=""
                                    />
                                )
                            ) : solenoids["MvasOpen"]["expected"] ? (
                                <img
                                    src="/button_on_closed.png"
                                    alt=""
                                />
                            ) : (
                                <img
                                    src="/button_off_closed.png"
                                    alt=""
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.ecuBox}>
                <div className={styles.boundingBox}>
                    <h2
                        className={styles.title}
                        data-testid="ecuPanel"
                    >
                        ECU
                    </h2>
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
                                    enabled={keydown === TOGGLE_KEY}
                                />
                                <RocketSwitch
                                    name="Vent"
                                    className="switches"
                                    expected_value={solenoids["Vent"]["expected"]}
                                    feedback_value={solenoids["Vent"]["current"]}
                                    onClick={(event) => handleToggleState("ecu", "Vent", event)}
                                    enabled={keydown === TOGGLE_KEY}
                                />
                            </div>
                            <div className={styles.switchRow}>
                                <RocketSwitch
                                    name="PV1"
                                    className="switches"
                                    expected_value={solenoids["Pv1"]["expected"]}
                                    feedback_value={solenoids["Pv1"]["current"]}
                                    onClick={(event) => handleToggleState("ecu", "Pv1", event)}
                                    enabled={keydown === TOGGLE_KEY}
                                />
                                <RocketSwitch
                                    name="PV2"
                                    className="switches"
                                    expected_value={solenoids["Pv2"]["expected"]}
                                    feedback_value={solenoids["Pv2"]["current"]}
                                    onClick={(event) => handleToggleState("ecu", "Pv2", event)}
                                    enabled={keydown === TOGGLE_KEY}
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
        </div>
    ) : (
        <> Loading data for dashboard page</>
    );
}
