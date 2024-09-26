import React from "react";
// import diagram from './diagram.png';
import styles from "./DiagramPage.module.css";
import {updateRocket} from "../webservice";
import ToggleButton from "../toggle_button/ToggleButton";

export function DiagramPage() {
    const handleToggleSolenoid = (systemName, solenoidName, newState) => {
        console.log("toggling solenoid");
        console.log(newState);
        updateRocket(systemName, solenoidName, newState);
    };
    const solenoids = undefined;
    const timestamp = undefined;
    return 1 == 1 ? (
        <div></div>
    ) : timestamp ? (
        <div className={styles.container}>
            <div className={styles.testy}>
                <img
                    src="/diagram.png"
                    alt=""
                />
            </div>
            <ToggleButton
                className={styles.copvbv}
                feedback_value={solenoids["CopvVent"]["expected"]}
                customClick={(event) => handleToggleSolenoid("ecu", "CopvVent", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.vent}
                feedback_value={solenoids["Vent"]["expected"]}
                customClick={(event) => handleToggleSolenoid("ecu", "Vent", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.gn2vent}
                feedback_value={solenoids["Gn2Vent"]["expected"]}
                customClick={(event) => handleToggleSolenoid("gse", "Gn2Vent", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.loxvent}
                feedback_value={solenoids["LoxVent"]["expected"]}
                customClick={(event) => handleToggleSolenoid("gse", "LoxVent", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.lngvent}
                feedback_value={solenoids["LngVent"]["expected"]}
                customClick={(event) => handleToggleSolenoid("gse", "LngVent", event)}
            ></ToggleButton>

            <ToggleButton
                className={styles.gn2fill}
                feedback_value={solenoids["Gn2Fill"]["expected"]}
                customClick={(event) => handleToggleSolenoid("gse", "Gn2Fill", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.pv1}
                feedback_value={solenoids["Pv1"]["expected"]}
                customClick={(event) => handleToggleSolenoid("ecu", "Pv1", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.pv2}
                feedback_value={solenoids["Pv2"]["expected"]}
                customClick={(event) => handleToggleSolenoid("ecu", "Pv2", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.loxfill}
                feedback_value={solenoids["LoxFill"]["expected"]}
                customClick={(event) => handleToggleSolenoid("gse", "LoxFill", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.lngfill}
                feedback_value={solenoids["LngFill"]["expected"]}
                customClick={(event) => handleToggleSolenoid("gse", "LngFill", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.mvasfill}
                feedback_value={solenoids["MvasFill"]["expected"]}
                customClick={(event) => handleToggleSolenoid("gse", "MvasFill", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.mvasvent}
                feedback_value={solenoids["MvasVent"]["expected"]}
                customClick={(event) => handleToggleSolenoid("gse", "MvasVent", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.mvas}
                feedback_value={solenoids["Mvas"]["expected"]}
                customClick={(event) => handleToggleSolenoid("gse", "Mvas", event)}
            ></ToggleButton>
        </div>
    ) : (
        <></>
    );
}
