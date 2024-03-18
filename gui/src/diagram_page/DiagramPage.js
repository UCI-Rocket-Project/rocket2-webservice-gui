import React, {Component} from "react";
// import diagram from './diagram.png';
import styles from "./DiagramPage.module.css";
import {useSelector, useDispatch} from "react-redux";
import {selectPts, selectSolenoids, selectTcs, selectTimestamp} from "../redux/rocketSlice";
import {updateRocket} from "../webservice";
import ToggleButton from "../toggle_button/ToggleButton";

export function DiagramPage() {
    const solenoids = useSelector(selectSolenoids);
    const timestamp = useSelector(selectTimestamp);

    const handleToggleSolenoid = (systemName, solenoidName, value) => {
        console.log("toggling solenoid");
        console.log(value);
        updateRocket(systemName, solenoidName, value);
    };
    return timestamp ? (
        <div className={styles.container}>
            <div className={styles.testy}>
                <img src="/diagram.png" />
            </div>
            <ToggleButton
                className={styles.copvbv}
                feedback_value={solenoids["CopvVent"]["current"]}
                customClick={(event) => handleToggleSolenoid("ecu", "CopvVent", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.vent}
                feedback_value={solenoids["Vent"]["current"]}
                customClick={(event) => handleToggleSolenoid("ecu", "Vent", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.gn2vent}
                feedback_value={solenoids["Gn2Vent"]["current"]}
                customClick={(event) => handleToggleSolenoid("gse", "Gn2Vent", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.loxvent}
                feedback_value={solenoids["LoxVent"]["current"]}
                customClick={(event) => handleToggleSolenoid("gse", "LoxVent", event)}

            ></ToggleButton>
            <ToggleButton
                className={styles.lngvent}
                feedback_value={solenoids["LngVent"]["current"]}
                customClick={(event) => handleToggleSolenoid("gse", "LngVent", event)}
            ></ToggleButton>

            <ToggleButton
                className={styles.gn2fill}
                feedback_value={solenoids["Gn2Fill"]["current"]}
                customClick={(event) => handleToggleSolenoid("gse", "Gn2Fill", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.pv1}
                feedback_value={solenoids["Pv1"]["current"]}
                customClick={(event) => handleToggleSolenoid("ecu", "Pv1", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.pv2}
                feedback_value={solenoids["Pv2"]["current"]}
                customClick={(event) => handleToggleSolenoid("ecu", "Pv2", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.loxfill}
                feedback_value={solenoids["LoxFill"]["current"]}
                customClick={(event) => handleToggleSolenoid("gse", "LoxFill", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.lngfill}
                feedback_value={solenoids["LngFill"]["current"]}
                customClick={(event) => handleToggleSolenoid("gse", "LngFill", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.mvasfill}
                feedback_value={solenoids["MvasFill"]["current"]}
                customClick={(event) => handleToggleSolenoid("gse", "MvasFill", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.mvasvent}
                feedback_value={solenoids["MvasVent"]["current"]}
                customClick={(event) => handleToggleSolenoid("gse", "MvasVent", event)}
            ></ToggleButton>
            <ToggleButton
                className={styles.mvas}
                feedback_value={solenoids["Mvas"]["current"]}
                customClick={(event) => handleToggleSolenoid("gse", "Mvas", event)}
            ></ToggleButton>
        </div>
    ) : (
        <></>
    );
}
