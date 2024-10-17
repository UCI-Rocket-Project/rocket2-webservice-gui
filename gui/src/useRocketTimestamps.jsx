import {useState} from "react";

export function useRocketTimestamps() {
    const [lastGseTimeRecv, setLastGseTimeRecv] = useState(0);
    const [lastEcuTimeRecv, setLastEcuTimeRecv] = useState(0);

    const [lastGseTimestamp, setLastGseTimestamp] = useState(0);
    const [lastEcuTimestamp, setLastEcuTimestamp] = useState(0);

    const updateTimestamps = (timeRecv, systemName) => {
        const now = Date.now();

        if (systemName === "gse") {
            setLastGseTimeRecv((prevLastGseTimeRecv) => {
                if (timeRecv > prevLastGseTimeRecv) {
                    setLastGseTimestamp(now);
                    return timeRecv;
                }

                return prevLastGseTimeRecv;
            });
        }

        if (systemName === "ecu") {
            setLastEcuTimeRecv((prevLastEcuTimeRecv) => {
                if (timeRecv > prevLastEcuTimeRecv) {
                    setLastEcuTimestamp(now);
                    return timeRecv;
                }

                return prevLastEcuTimeRecv;
            });
        }
    };

    return {
        lastGseTimestamp,
        lastEcuTimestamp,
        updateTimestamps
    };
}
