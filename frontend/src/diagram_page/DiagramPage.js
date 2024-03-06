import React, { Component } from 'react';
import diagram from '../diagram.png';
import styles from "./DiagramPage.module.css";
import {useSelector, useDispatch} from "react-redux";
import {selectPts, selectSolenoids, selectTcs} from "../redux/rocketSlice";
import {updateRocket} from "../webservice";


export function DiagramPage() {
    const pts = useSelector(selectPts);
    const solenoids = useSelector(selectSolenoids);
    const tcs = useSelector(selectTcs);
    const dispatch = useDispatch();
    // systemName: "gse" or "ecu"
    const handleToggleSolenoid = (systemName, solenoidName, value) => {
        console.log("toggling solenoid");
        console.log(value);
        updateRocket(systemName, solenoidName, value);
    };
   
    return (
        <div className={styles.container}>
            <div className={styles.testy}>
                <img src={diagram}/>
                </div>
            <button className={styles.copvbv}>copvbv</button>
            <button className={styles.vent} onClick={(event) => handleToggleSolenoid("ecu", "Vent", event)}>vent</button>
            <button className={styles.gn2vent} onClick={(event) => handleToggleSolenoid("gse", "Gn2Vent", event)}>gn2vent</button>
            <button className={styles.mvasvent} onClick={(event) => handleToggleSolenoid("gse", "MvasVent", event)}>mvasvent</button>
            <button className={styles.loxvent} onClick={(event) => handleToggleSolenoid("gse", "LoxVent", event)}>loxvent</button>
            <button className={styles.lngvent} onClick={(event) => handleToggleSolenoid("gse", "LngVent", event)}>lngvent</button>

            <button className={styles.gn2fill} onClick={(event) => handleToggleSolenoid("gse", "Gn2Fill", event)}>gn2fill</button>
            <button className={styles.pv1} onClick={(event) => handleToggleSolenoid("ecu", "PV1", event)}>pv1</button>
            <button className={styles.pv2} onClick={(event) => handleToggleSolenoid("ecu", "PV2", event)}>pv2</button>
            <button className={styles.loxfill} onClick={(event) => handleToggleSolenoid("gse", "LoxFill", event)}>loxfill</button>
            <button className={styles.engvent}>engvent</button>
            <button className={styles.mvasfill} onClick={(event) => handleToggleSolenoid("gse", "MvasFill", event)}>mvasfill</button>
            <button className={styles.mvas}>mvas</button>
        </div>
    );
}
