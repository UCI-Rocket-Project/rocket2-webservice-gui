import {Link} from "react-router-dom";
import {useRocketTimestampsContext} from "./rocket-timestamps/rocketTimestampsContext";
import {useEffect, useState} from "react";
import styles from "./navbar.module.css";
export function Navbar() {
    const {lastGseTimestamp, lastEcuTimestamp, lastLoadCellTimestamp} =
        useRocketTimestampsContext();

    const [timeSinceLastGsePacket, setTimeSinceLastGsePacket] = useState();
    const [timeSinceLastEcuPacket, setTimeSinceLastEcuPacket] = useState();
    const [timeSinceLastLoadCellPacket, setTimeSinceLastLoadCellPacket] = useState();

    useEffect(() => {
        setTimeSinceLastGsePacket(Date.now() - lastGseTimestamp);
    }, [lastGseTimestamp]);

    useEffect(() => {
        setTimeSinceLastEcuPacket(Date.now() - lastEcuTimestamp);
    }, [lastEcuTimestamp]);

    useEffect(() => {
        setTimeSinceLastLoadCellPacket(Date.now() - lastLoadCellTimestamp);
    }, [lastLoadCellTimestamp]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSinceLastGsePacket((prev) => prev + 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, [lastGseTimestamp]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSinceLastEcuPacket((prev) => prev + 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, [lastEcuTimestamp]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSinceLastLoadCellPacket((prev) => prev + 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, [lastLoadCellTimestamp]);

    return (
        <div>
            <div className={styles.topSpacing}></div>
            <div className={styles.navbar}>
                <div className={styles.navbarButtons}>
                    <Link
                        to="/"
                        className={`${styles.lastButton} ${styles.navbarButton} `}
                    >
                        <div className={styles.unskewed}>Dashboard</div>
                    </Link>
                    <Link
                        to="/telemetry"
                        className={styles.navbarButton}
                    >
                        <div className={styles.unskewed}>Telemetry</div>
                    </Link>
                    <Link
                        to="/analytics"
                        className={styles.navbarButton}
                    >
                        <div className={styles.unskewed}>Analytics</div>
                    </Link>
                </div>
                <div className={styles.systemStatuses}>
                    {/* <span>Time since last packet:</span> */}

                    <span
                        style={{
                            display: "flex",
                            paddingRight: 40,
                            color: timeSinceLastGsePacket > 1000 ? "red" : null
                        }}
                    >
                        GSE:{" "}
                        <span style={{minWidth: 60, textAlign: "right"}}>
                            {timeSinceLastGsePacket}ms
                        </span>
                    </span>
                    <span
                        style={{
                            display: "flex",
                            paddingRight: 40,
                            color: timeSinceLastEcuPacket > 1000 ? "red" : null
                        }}
                    >
                        ECU:{" "}
                        <span style={{minWidth: 60, textAlign: "right"}}>
                            {timeSinceLastEcuPacket}ms
                        </span>
                    </span>
                    <span
                        style={{
                            display: "flex",
                            paddingRight: 40,
                            color: timeSinceLastLoadCellPacket > 1000 ? "red" : null
                        }}
                    >
                        Load Cell:{" "}
                        <span style={{minWidth: 60, textAlign: "right"}}>
                            {timeSinceLastLoadCellPacket}ms
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
