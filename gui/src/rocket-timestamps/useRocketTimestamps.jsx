import {useState} from "react";

export function useRocketTimestamps() {
    const [lastGseTimeRecv, setLastGseTimeRecv] = useState(0);
    const [lastGseTimestamp, setLastGseTimestamp] = useState(0);

    const [lastEcuTimeRecv, setLastEcuTimeRecv] = useState(0);
    const [lastEcuTimestamp, setLastEcuTimestamp] = useState(0);

    const [lastLoadCellTimeRecv, setLastLoadCellTimeRecv] = useState(0);
    const [lastLoadCellTimestamp, setLastLoadCellTimestamp] = useState(0);

    const updateTimestamps = (timeRecv, system) => {
        if (system === "gse" && timeRecv !== lastGseTimeRecv) {
            const now = Date.now();
            setLastGseTimeRecv((prev) => {
                if (prev !== timeRecv) {
                    setLastGseTimestamp(now);

                    return timeRecv;
                } else {
                    return prev;
                }
            });
        }

        if (system === "ecu" && timeRecv !== lastEcuTimeRecv) {
            const now = Date.now();
            setLastEcuTimeRecv((prev) => {
                if (prev !== timeRecv) {
                    setLastEcuTimestamp(now);

                    return timeRecv;
                } else {
                    return prev;
                }
            });
        }

        if (system === "load_cell" && timeRecv !== lastLoadCellTimeRecv) {
            const now = Date.now();
            setLastLoadCellTimeRecv((prev) => {
                if (prev !== timeRecv) {
                    setLastLoadCellTimestamp(now);

                    return timeRecv;
                } else {
                    return prev;
                }
            });
        }
    };

    return {
        lastGseTimestamp,
        lastEcuTimestamp,
        lastLoadCellTimestamp,
        updateTimestamps
    };
}
