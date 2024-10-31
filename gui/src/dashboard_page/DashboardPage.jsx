import React, {useContext, useEffect, useState} from "react";
import styles from "./DashboardPage.module.css";
import {RocketState} from "../Context";
import {PressureDecay} from "./tooling/pressure-decay/pressure-decay";
import {Gse} from "./Gse";
import {Ecu} from "./Ecu";
import {Thermocouple} from "./tooling/tc/thermocouple";
import {AbortButton} from "../abort_button/AbortButton";

let TOGGLE_KEY = "Control";

if (navigator.platform.indexOf("Mac") !== -1 || navigator.userAgent.indexOf("Mac OS") !== -1) {
    TOGGLE_KEY = "x";
}

export function DashboardPage() {
    const {hasInitialized} = useContext(RocketState);

    const [keydown, setKeydown] = useState();

    useEffect(() => {
        const handleKeyDown = (event) => {
            setKeydown(event.key);
        };

        const handleKeyUp = () => {
            setKeydown(null);
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    if (!hasInitialized.current) {
        return <> Loading data for dashboard page</>;
    }

    return (
        <div className={styles.row}>
            <div className={styles.tooling}>
                <div
                    className={styles.boundingBox}
                    style={{width: 450}}
                >
                    <h2 className={styles.title}>ABORT</h2>
                    <AbortButton
                        toggleKey={TOGGLE_KEY}
                        keydown={keydown}
                    />
                </div>
                <div
                    className={styles.boundingBox}
                    style={{height: "100%"}}
                >
                    <h2 className={styles.title}>Tooling</h2>

                    <div
                        className={styles.toolingBoundingBox}
                        style={{
                            paddingLeft: 12,
                            paddingRight: 12,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16
                        }}
                    >
                        <PressureDecay />
                        <Thermocouple />
                    </div>
                </div>
            </div>
            <Gse
                toggleKey={TOGGLE_KEY}
                keydown={keydown}
            />
            <Ecu
                toggleKey={TOGGLE_KEY}
                keydown={keydown}
            />
        </div>
    );
}
