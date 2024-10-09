import {useState} from "react";

export function useRocketTimestamps() {
    // stores time_recv of last fresh packet
    const [lastGseTimeRecv, setLastGseTimeRecv] = useState(0);
    const [lastEcuTimeRecv, setLastEcuTimeRecv] = useState(0);

    // stores Unix timestamp of last fresh packet
    const [lastGseTimestamp, setLastGseTimestamp] = useState(0);
    const [lastEcuTimestamp, setLastEcuTimestamp] = useState(0);

    const updateTimestamps = (timeRecv, systemName) => {
        if (systemName === "gse" && timeRecv > lastGseTimeRecv) {
            setLastGseTimeRecv(timeRecv);
            setLastGseTimestamp(Date.now());
        }

        if (systemName === "ecu" && timeRecv > lastEcuTimeRecv) {
            setLastEcuTimeRecv(timeRecv);
            setLastEcuTimestamp(Date.now());
        }
    };

    return {
        lastGseTimestamp,
        lastEcuTimestamp,
        updateTimestamps
    };
}
