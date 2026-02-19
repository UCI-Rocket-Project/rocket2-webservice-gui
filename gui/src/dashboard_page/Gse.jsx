import {useContext} from "react";
import styles from "./DashboardPage.module.css";
import RocketGauge from "../rocket_gauge/RocketGauge";
import RocketSwitch from "../rocket_switch/RocketSwitch";
import {RocketState} from "../Context";
import {useToolingContext} from "./tooling/tooling-context/tooling-context";
import RocketToggle  from "../rocket_toggle/RocketToggle";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function Gse({toggleKey, keydown}) {
    const {solenoids, pts, tcs, igniters, misc, handleToggleState, isAborted} =
        useContext(RocketState);

    const {handleStopPressureFill} = useToolingContext();
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
                    
                </div>
                <div className={styles.gseGaugeRow}>
                <RocketGauge
                        value={pts.Vent}
                        minValue={0}
                        maxValue={120}
                        units={" psi"}
                        name={"Vent PT"} //change the name to "vent pt" --fix-next-commit
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 70}, {limit: 100}, {limit: 120}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                <RocketGauge
                        value={pts.LoxInjTee}
                        minValue={0}
                        maxValue={500}
                        units={" psi"}
                        name={"PT4"}
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 400}, {limit: 450}, {limit: 500}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                </div>
                <div className={styles.ecuGaugeRow}>
                    <RocketGauge
                        value={pts.Two}
                        minValue={0}
                        maxValue={500}
                        name={"*LOX INJ PT"}
                        units={" psi"}
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 400}, {limit: 450}, {limit: 500}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                    <RocketGauge
                        value={pts.Three}
                        minValue={0}
                        maxValue={500}
                        name={"*LNG INJ PT"}
                        units={" psi"}
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 400}, {limit: 450}, {limit: 500}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                </div>
                <div className={styles.ecuGaugeRow}>
                    <RocketGauge
                        value={pts.Four}
                        minValue={0}
                        maxValue={500}
                        name={"SPARE 4 PT"}
                        units={" psi"}
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 400}, {limit: 450}, {limit: 500}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                    <RocketGauge
                        value={pts.Five}
                        minValue={0}
                        maxValue={500}
                        name={"SPARE 5 PT"}
                        units={" psi"}
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 400}, {limit: 450}, {limit: 500}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                </div>
                {/* <div className={styles.gseGaugeRow}>
                <RocketGauge
                        value={pts.LoxInjTee}
                        minValue={0}
                        maxValue={120}
                        units={" psi"}
                        name={"LoxInjTee"} //change the name to "vent pt" --fix-next-commit
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 70}, {limit: 100}, {limit: 120}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                <RocketGauge
                        value={pts.LoxMvas}
                        minValue={0}
                        maxValue={120}
                        units={" psi"}
                        name={"LoxMvas"} //change the name to "vent pt" --fix-next-commit
                        arc={{
                            colorArray: ["#5BE12C", "#FFAC1C", "#EA4228"],
                            subArcs: [{limit: 70}, {limit: 100}, {limit: 120}],
                            padding: 0.02,
                            width: 0.3
                        }}
                    />
                </div> */}
                <div className={styles.gseGaugeRow}>
                
                </div>
                {/* GSE top row switches */}
                <div className={styles.switchRow}>
                    <RocketSwitch
                        expected_value={solenoids["Gn2Vent"]?.expected}
                        feedback_value={solenoids["Gn2Vent"]?.current}
                        onClick={(event) => handleToggleState("gse", "Gn2Vent", event)}
                        name="GN2 Vent"
                        enabled={keydown === toggleKey && !isAborted}
                    />
                    <RocketSwitch
                        name="GN2 Fill"
                        expected_value={solenoids["Gn2Fill"]?.expected}
                        feedback_value={solenoids["Gn2Fill"]?.current}
                        onClick={(event) => {
                            handleToggleState("gse", "Gn2Fill", event);

                            if (!event) {
                                handleStopPressureFill();
                            }
                        }}
                        enabled={keydown === toggleKey && !isAborted}
                    />
                </div>
                <div className={styles.switchRow}>
                    <RocketSwitch
                        name="GN2 QD"
                        expected_value={solenoids["Gn2Disconnect"]?.expected}
                        feedback_value={solenoids["Gn2Disconnect"]?.current}
                        onClick={(event) => handleToggleState("gse", "Gn2Disconnect", event)}
                        enabled={keydown === toggleKey && !isAborted}
                    />
                    {/* <RocketSwitch
                        name="MVAS"
                        expected_value={solenoids["MvasOpen"]?.expected}
                        feedback_value={solenoids["MvasOpen"]?.expected}
                        onClick={ (event) => {
                            if (solenoids["MvasOpen"]["expected"] == 0) {
                                handleToggleState("gse", "MvasClose", 0);
                                handleToggleState("gse", "MvasOpen", 1);
                            } else {
                                handleToggleState("gse", "MvasOpen", 0);
                                handleToggleState("gse", "MvasClose", 1);
                            }
                        }}
                        enabled={keydown === toggleKey && !isAborted}
                    /> */}
                </div>
                <div className={styles.switchRow}>
                    <RocketToggle
                        name="MVASOPEN"
                        delay={0}
                        expected_value={solenoids["MvasOpen"]?.expected}
                        feedback_value={solenoids["MvasOpen"]?.feedback}
                        enabled={keydown === toggleKey && !isAborted}
                        onClick={async () => {
                            handleToggleState("gse", "MvasOpen", 1);
                            await delay(1000);
                            const error = (solenoids["MvasOpen"] === 0); // success
                            console.log(error);
                            handleToggleState("gse", "MvasOpen", 0);
                            return error;
                            }
                        }
                        />
                    <RocketToggle
                        name="MVASCLOSE"
                        delay={0}
                        expected_value={solenoids["MvasClose"]?.expected}
                        feedback_value={solenoids["MvasClose"]?.feedback}
                        enabled={keydown === toggleKey && !isAborted}
                        onClick={async () => {
                            handleToggleState("gse", "MvasClose", 1);
                            await delay(1000);
                            const error = (solenoids["MvasClose"] === 1); // success
                            handleToggleState("gse", "MvasClose", 0);
                            return error;
                            }
                        }
                        />
                </div>
                <div className={styles.switchRow}>
                    <RocketSwitch
                        name="Igniter 1"
                        expected_value={igniters["0"]?.expected}
                        feedback_value={igniters["0"]?.current}
                        onClick={(event) => handleToggleState("gse", "0", event)}
                        enabled={keydown === toggleKey && !isAborted}
                        switch_type="igniter"
                    />

                    <RocketSwitch
                        name="Igniter 2"
                        expected_value={igniters["1"]?.expected}
                        feedback_value={igniters["1"]?.current}
                        onClick={(event) => handleToggleState("gse", "1", event)}
                        enabled={keydown === toggleKey && !isAborted}
                        switch_type="igniter"
                    />
                </div>

                <div className={styles.switchRow}>
                    <RocketSwitch
                        name="Alarm"
                        expected_value={misc["alarmExpected"]}
                        feedback_value={misc["alarmExpected"]}
                        onClick={(event) => handleToggleState("gse", "alarmExpected", event)}
                        enabled={keydown === toggleKey && !isAborted}
                    />
                    {igniters.armed ? (
                        <img
                            style={{width: "160px", height: "190px", marginTop: -20, zIndex: 1}}
                            src="/key_armed.png"
                            alt=""
                        />
                    ) : (
                        <img
                            style={{width: "160px", height: "190px", marginTop: -20, zIndex: 1}}
                            src="/key_unarmed.png"
                            alt=""
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
