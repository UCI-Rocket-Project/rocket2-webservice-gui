import {Link} from "react-router-dom";
import {useRocketTimestampsContext} from "./rocket-timestamps/rocketTimestampsContext";
import {useEffect, useState} from "react";

export function Navbar() {
    const {lastGseTimestamp, lastEcuTimestamp} = useRocketTimestampsContext();

    const [timeSinceLastGsePacket, setTimeSinceLastGsePacket] = useState();
    const [timeSinceLastEcuPacket, setTimeSinceLastEcuPacket] = useState();

    useEffect(() => {
        setTimeSinceLastGsePacket(Date.now() - lastGseTimestamp);
    }, [lastGseTimestamp]);

    useEffect(() => {
        setTimeSinceLastEcuPacket(Date.now() - lastEcuTimestamp);
    }, [lastEcuTimestamp]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSinceLastGsePacket((prev) => prev + 1000);
            setTimeSinceLastEcuPacket((prev) => prev + 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, [lastGseTimestamp, lastEcuTimestamp]);

    return (
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <div>
                <button>
                    <Link to="/">Dashboard</Link>
                </button>
                <button>
                    <Link to="/rocket">Rocket</Link>
                </button>
                <button>
                    <Link to="/telemetry">Telemetry</Link>
                </button>
                <button>
                    <Link to="/analytics">Analytics</Link>
                </button>
            </div>

            <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                <span>Time since last packet:</span>

                <span
                    style={{display: "flex", color: timeSinceLastGsePacket > 1000 ? "red" : null}}
                >
                    GSE:{" "}
                    <span style={{minWidth: 60, textAlign: "right"}}>
                        {timeSinceLastGsePacket}ms
                    </span>
                </span>
                <span
                    style={{display: "flex", color: timeSinceLastEcuPacket > 1000 ? "red" : null}}
                >
                    ECU:{" "}
                    <span style={{minWidth: 60, textAlign: "right"}}>
                        {timeSinceLastEcuPacket}ms
                    </span>
                </span>
            </div>
        </div>
    );
}
