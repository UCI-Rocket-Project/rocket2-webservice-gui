import React, {useContext, useEffect, useState} from "react";
import styles from "./DashboardPage.module.css";
import {RocketState} from "../Context";
import {PressureChartContainer} from "./pressure_graph/PressureChartContainer";
import {Gse} from "./Gse";
import {Ecu} from "./Ecu";
import {TcChartContainer} from "./tc_graph/TcChartContainer";
import {LoadCellChartContainer} from "./load_cell_graph/LoadCellChartContainer";
import {Tooling} from "./tooling/tooling";
import { PressureChartContainerLines } from "./pressure_graph_lines/PressureChartContainerLines";

let TOGGLE_KEY = "Control";

if (navigator.platform.indexOf("Mac") !== -1 || navigator.userAgent.indexOf("Mac OS") !== -1) {
    TOGGLE_KEY = "x";
}

export function DashboardPage({viewOnly=false}) {
    const {hasInitialized} = useContext(RocketState);

    const [keydown, setKeydown] = useState();

    useEffect(() => {
        const handleKeyDown = (event) => {
            setKeydown(event.key);
        };

        const handleKeyUp = () => {
            setKeydown(null);
        };
        if(!viewOnly){
            document.addEventListener("keydown", handleKeyDown);
            document.addEventListener("keyup", handleKeyUp);

            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                document.removeEventListener("keyup", handleKeyUp);
            };
        }
    }, []);

    if (!hasInitialized.current) {
        return <> Loading data for dashboard page</>;
    }

    return (
        <div className={styles.row}>
            <Tooling />

            <Gse
                toggleKey={TOGGLE_KEY}
                keydown={keydown}
            />
            <div
                className={styles.graphBox}
                style={{overflowY: "auto", height: "95vh"}}
            >
                <PressureChartContainer />
                <PressureChartContainerLines />
                <LoadCellChartContainer />
            </div>
            <Ecu
                toggleKey={TOGGLE_KEY}
                keydown={keydown}
            />
        </div>
    );
}
