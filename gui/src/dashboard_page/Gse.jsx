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
                    ></RocketSwitch>
                    <RocketSwitch
                        name="GN2 Fill"
                        className="switches"
                        expected_value={solenoids["Gn2Fill"]["expected"]}
                        feedback_value={solenoids["Gn2Fill"]["current"]}
                        onClick={(event) => handleToggleState("gse", "Gn2Fill", event)}
                        enabled={keydown === toggleKey}
                    ></RocketSwitch>
                    <RocketSwitch
                        name="GN2 QD"
                        className="switches"
                        expected_value={solenoids["Gn2Disconnect"]["expected"]}
                        feedback_value={solenoids["Gn2Disconnect"]["current"]}
                        onClick={(event) => handleToggleState("gse", "Gn2Disconnect", event)}
                        enabled={keydown === toggleKey}
                    ></RocketSwitch>
                </div>

                {/* GSE bottom row switches */}

                <div className={styles.switchRow}>
                    <RocketSwitch
                        name="Igniter 1"
                        className="switches"
                        expected_value={igniters["0"]["expected"]}
                        feedback_value={igniters["0"]["current"]}
                        onClick={(event) => handleToggleState("gse", "0", event)}
                        enabled={keydown === toggleKey}
                        switch_type="igniter"
                    ></RocketSwitch>
                    <div style={{width: 175}}></div>
                    <RocketSwitch
                        name="Alarm"
                        className="switches"
                        expected_value={-1}
                        feedback_value={-1}
                        onClick={(event) => handleToggleState("gse", "0", event)}
                        enabled={keydown === toggleKey}
                    ></RocketSwitch>
                </div>
                <div className={styles.switchRow}>
                    <RocketSwitch
                        name="Igniter 2"
                        className="switches"
                        expected_value={igniters["1"]["expected"]}
                        feedback_value={igniters["1"]["current"]}
                        onClick={(event) => handleToggleState("gse", "1", event)}
                        enabled={keydown === toggleKey}
                        switch_type="igniter"
                    ></RocketSwitch>
                    {igniters.armed ? (
                        <img
                            style={{width: "200px", height: "213px", marginTop: -50}}
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
                    <RocketSwitch
                        name="MVAS"
                        className="switches"
                        expected_value={solenoids["MvasOpen"]["expected"]}
                        feedback_value={solenoids["MvasOpen"]["expected"]}
                        onClick={(event) => {
                            if (solenoids["MvasOpen"]["expected"] == 0) {
                                handleToggleState("gse", "MvasClose", 0);
                                handleToggleState("gse", "MvasOpen", 1);
                            } else {
                                handleToggleState("gse", "MvasOpen", 0);
                                handleToggleState("gse", "MvasClose", 1);
                            }
                        }}
                        enabled={keydown === toggleKey}
                    ></RocketSwitch>
                </div>
            </div>
        </div>
    );
}