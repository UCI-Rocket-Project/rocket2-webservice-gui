import {Link} from "react-router-dom";
import {useContext} from "react";
import {RocketState} from "./Context";

export function Navbar() {
    const {lastFetchTimestamp} = useContext(RocketState);

    const timeSince = Date.now() - lastFetchTimestamp;

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

            <span style={{display: "flex", color: timeSince > 1000 ? "red" : null}}>
                Time since last fetch: {timeSince}ms
            </span>
        </div>
    );
}
