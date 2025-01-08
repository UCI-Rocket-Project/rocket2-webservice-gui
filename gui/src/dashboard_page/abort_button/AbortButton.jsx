import React, {useContext} from "react";
import styles from "./AbortButton.module.css";
import {RocketState} from "../../Context";

export function AbortButton({keydown, toggleKey}) {
    const {isAborted, handleToggleState, handleAbort} = useContext(RocketState);
    return (
        <div className={styles.abort}>
            {keydown === toggleKey ? (
                isAborted ? (
                    <img
                        onClick={(event) => handleAbort(false)}
                        src="/button_on_open.png"
                        style={{width: 300}}
                        alt=""
                    />
                ) : (
                    <img
                        onClick={(event) => {
                            {
                                handleAbort(true);
                                handleToggleState("ecu", "Vent", 0);
                                handleToggleState("ecu", "Pv1", 0);
                                handleToggleState("ecu", "Pv2", 0);
                                handleToggleState("ecu", "CopvVent", 1);
                                handleToggleState("gse", "Gn2Fill", 0);
                                handleToggleState("gse", "Gn2Vent", 1);
                                handleToggleState("gse", "MvasClose", 0);
                                handleToggleState("gse", "MvasOpen", 1);
                            }
                        }}
                        src="/button_off_open.png"
                        style={{width: 300}}
                        alt=""
                    />
                )
            ) : isAborted ? (
                <img
                    src="/button_on_closed.png"
                    style={{width: 300}}
                    alt=""
                />
            ) : (
                <img
                    src="/button_off_closed.png"
                    style={{width: 300}}
                    alt=""
                />
            )}
        </div>
    );
}
