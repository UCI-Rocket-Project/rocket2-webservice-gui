import React, {useContext, useEffect, useState} from "react";
import styles from "./DashboardPage.module.css";
import {RocketState} from "../Context";
import {PressureChartContainer} from "./pressure_graph/PressureChartContainer";
import {Gse} from "./Gse";
import {Ecu} from "./Ecu";
import {TcChartContainer} from "./tc_graph/TcChartContainer";
import {PressureDecay} from "./tooling/pressure-decay/pressure-decay";
import {LoadCellChartContainer} from "./load_cell_graph/LoadCellChartContainer";

let TOGGLE_KEY = "Control";

if (navigator.platform.indexOf("Mac") !== -1 || navigator.userAgent.indexOf("Mac OS") !== -1) {
    TOGGLE_KEY = "x";
}
function ArrowIcon(props) {
    return (
        <svg
            viewBox="0 0 64 64"
            fill="currentColor"
            height="50px"
            width="50px"
            {...props}
        >
            <path
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={5}
                d="M15 24l17 17 17-17"
            />
        </svg>
    );
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
            <div className={styles.dropdown}>
                <div className={styles.dropdownContent}>
                    <div className={styles.tooling}>
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
                        </div>
                    </div>
                </div>
                <div style={{width: "100%", height: 50, fontSize: 30, textAlign: "center"}}>
                    <ArrowIcon></ArrowIcon>
                </div>
            </div>
            <Gse
                toggleKey={TOGGLE_KEY}
                keydown={keydown}
            />
            <div
                className={styles.graphBox}
                style={{overflow: "scroll", height: "100dvh"}}
            >
                <TcChartContainer />
                <PressureChartContainer />
                <LoadCellChartContainer />
            </div>
            <Ecu
                toggleKey={TOGGLE_KEY}
                keydown={keydown}
            />
        </div>
    );
}
