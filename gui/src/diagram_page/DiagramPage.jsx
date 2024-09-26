import React, {useContext} from "react";
// import diagram from './diagram.png';
import styles from "./DiagramPage.module.css";
import ToggleButton from "../toggle_button/ToggleButton";
import {RocketState} from "../Context";

export function DiagramPage() {
    const {solenoids, timestamp, handleToggleState} = useContext(RocketState);

    return timestamp ? (
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
                customClick={(event) => handleToggleState("ecu", "CopvVent", event)}
            />
            <ToggleButton
                className={styles.vent}
                feedback_value={solenoids["Vent"]["expected"]}
                customClick={(event) => handleToggleState("ecu", "Vent", event)}
            />
            <ToggleButton
                className={styles.gn2vent}
                feedback_value={solenoids["Gn2Vent"]["expected"]}
                customClick={(event) => handleToggleState("gse", "Gn2Vent", event)}
            />
            <ToggleButton
                className={styles.loxvent}
                feedback_value={solenoids["LoxVent"]["expected"]}
                customClick={(event) => handleToggleState("gse", "LoxVent", event)}
            />
            <ToggleButton
                className={styles.lngvent}
                feedback_value={solenoids["LngVent"]["expected"]}
                customClick={(event) => handleToggleState("gse", "LngVent", event)}
            />

            <ToggleButton
                className={styles.gn2fill}
                feedback_value={solenoids["Gn2Fill"]["expected"]}
                customClick={(event) => handleToggleState("gse", "Gn2Fill", event)}
            />
            <ToggleButton
                className={styles.pv1}
                feedback_value={solenoids["Pv1"]["expected"]}
                customClick={(event) => handleToggleState("ecu", "Pv1", event)}
            />
            <ToggleButton
                className={styles.pv2}
                feedback_value={solenoids["Pv2"]["expected"]}
                customClick={(event) => handleToggleState("ecu", "Pv2", event)}
            />
            <ToggleButton
                className={styles.loxfill}
                feedback_value={solenoids["LoxFill"]["expected"]}
                customClick={(event) => handleToggleState("gse", "LoxFill", event)}
            />
            <ToggleButton
                className={styles.lngfill}
                feedback_value={solenoids["LngFill"]["expected"]}
                customClick={(event) => handleToggleState("gse", "LngFill", event)}
            />
            <ToggleButton
                className={styles.mvasfill}
                feedback_value={solenoids["MvasFill"]["expected"]}
                customClick={(event) => handleToggleState("gse", "MvasFill", event)}
            />
            <ToggleButton
                className={styles.mvasvent}
                feedback_value={solenoids["MvasVent"]["expected"]}
                customClick={(event) => handleToggleState("gse", "MvasVent", event)}
            />
        </div>
    ) : (
        <></>
    );
}
