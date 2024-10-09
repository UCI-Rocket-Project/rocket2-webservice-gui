import React, {useContext, useEffect, useState} from "react";
import styles from "./DashboardPage.module.css";
import {RocketState} from "../Context";
import {PressureDecay} from "./tooling/pressure-decay";
import {Gse} from "./Gse";
import {Ecu} from "./Ecu";

export function DashboardPage() {
    const TOGGLE_KEY = "Control";
    const {timestamp} = useContext(RocketState);

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

    return timestamp ? (
        <div className={styles.row}>
            <div className={styles.tooling}>
                <div
                    className={styles.boundingBox}
                    style={{height: "100%"}}
                >
                    <h2>Tooling</h2>

                    <div
                        className={styles.toolingBoundingBox}
                        style={{paddingLeft: 12, paddingRight: 12}}
                    >
                        <PressureDecay />
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
    ) : (
        <> Loading data for dashboard page</>
    );
}
