import {useContext} from "react";
import styles from "./DashboardPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
import RocketSwitch from "../rocket_switch/RocketSwitch";
import {RocketState} from "../Context";

export function Gse({toggleKey, keydown}) {
    const {solenoids, tcs, pts, igniters, handleToggleState} = useContext(RocketState);

    return (
        <div className={styles.gseBox}>
            <div className={styles.boundingBox}>
                <h2 data-testid="gsePanel">GSE</h2>
                <div className={styles.gseGaugeRow}>
                    <RocketGauge
                        value={pts.Gn2}
                        minValue={0}
                        maxValue={6000}
                        units={"psi"}
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
                        enabled={keydown === toggleKey}
                    />
                    <RocketSwitch
                        name="LOX Vent"
                        className="switches"
                        expected_value={solenoids["LoxVent"]["expected"]}
                        feedback_value={solenoids["LoxVent"]["current"]}
                        onClick={(event) => handleToggleState("gse", "LoxVent", event)}
                        enabled={keydown === toggleKey}
                        isNormallyOpen={true} // figure ito ut
                    />
                    <RocketSwitch
                        name="LNG Vent"
                        className="switches"
                        expected_value={solenoids["LngVent"]["expected"]}
                        feedback_value={solenoids["LngVent"]["current"]}
                        onClick={(event) => handleToggleState("gse", "LngVent", event)}
                        enabled={keydown === toggleKey}
                        isNormallyOpen={true} // figure it out
                    />
                    <RocketSwitch
                        name="MVAS Vent"
                        className="switches"
                        expected_value={solenoids["MvasVent"]["expected"]}
                        feedback_value={solenoids["MvasVent"]["current"]}
                        onClick={(event) => handleToggleState("gse", "MvasVent", event)}
                        enabled={keydown === toggleKey}
                    />
                </div>

                {/* GSE bottom row switches */}
                <div className={styles.switchRow}>
                    <RocketSwitch
                        name="GN2 Fill"
                        className="switches"
                        expected_value={solenoids["Gn2Fill"]["expected"]}
                        feedback_value={solenoids["Gn2Fill"]["current"]}
                        onClick={(event) => handleToggleState("gse", "Gn2Fill", event)}
                        enabled={keydown === toggleKey}
                    />
                    <RocketSwitch
                        name="MVAS Open"
                        className="switches"
                        expected_value={solenoids["MvasOpen"]["expected"]}
                        feedback_value={solenoids["MvasOpen"]["current"]}
                        onClick={(event) => handleToggleState("gse", "MvasOpen", event)}
                        enabled={keydown === toggleKey}
                    />
                    <RocketSwitch
                        name="MVAS Close"
                        className="switches"
                        expected_value={solenoids["MvasClose"]["expected"]}
                        feedback_value={solenoids["MvasClose"]["current"]}
                        onClick={(event) => handleToggleState("gse", "MvasClose", event)}
                        enabled={keydown === toggleKey}
                    />
                    <RocketSwitch
                        name="MVAS Fill"
                        className="switches"
                        expected_value={solenoids["MvasFill"]["expected"]}
                        feedback_value={solenoids["MvasFill"]["current"]}
                        onClick={(event) => handleToggleState("gse", "MvasFill", event)}
                        enabled={keydown === toggleKey}
                    />
                </div>
                <div className={styles.launchRow}>
                    <div>
                        <RocketSwitch
                            name="Gn2 Disconnect"
                            className="switches"
                            expected_value={solenoids["Gn2Disconnect"]["expected"]}
                            feedback_value={solenoids["Gn2Disconnect"]["current"]}
                            onClick={(event) => handleToggleState("gse", "Gn2Disconnect", event)}
                            enabled={keydown === toggleKey}
                        />
                        <RocketSwitch
                            name="Alarm"
                            className="switches"
                            expected_value={-1}
                            feedback_value={-1}
                            onClick={(event) => handleToggleState("gse", "0", event)}
                            enabled={keydown === toggleKey}
                        />
                    </div>
                    <div style={{flex: 2}}></div>
                    <div>
                        <RocketSwitch
                            name="Igniter 1"
                            className="switches"
                            expected_value={igniters["0"]["expected"]}
                            feedback_value={igniters["0"]["current"]}
                            onClick={(event) => handleToggleState("gse", "0", event)}
                            enabled={keydown === toggleKey}
                            switch_type="igniter"
                        />
                        <RocketSwitch
                            name="Igniter 2"
                            className="switches"
                            expected_value={igniters["1"]["expected"]}
                            feedback_value={igniters["1"]["current"]}
                            onClick={(event) => handleToggleState("gse", "1", event)}
                            enabled={keydown === toggleKey}
                            switch_type="igniter"
                        />
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
                        {keydown === toggleKey ? (
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
    );
}
