import {Link} from "react-router-dom";
import {useContext} from "react";
import {RocketState} from "./Context";

export function Navbar() {
    const {lastGseTimestamp, lastEcuTimestamp} = useContext(RocketState);

    const gseTimeSince = Date.now() - lastGseTimestamp;
    const ecuTimeSince = Date.now() - lastEcuTimestamp;

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

                <span style={{display: "flex", color: gseTimeSince > 1000 ? "red" : null}}>
                    GSE: <span style={{minWidth: 60, textAlign: "right"}}>{gseTimeSince}ms</span>
                </span>
                <span style={{display: "flex", color: ecuTimeSince > 1000 ? "red" : null}}>
                    ECU: <span style={{minWidth: 60, textAlign: "right"}}>{ecuTimeSince}ms</span>
                </span>
            </div>
        </div>
    );
}
