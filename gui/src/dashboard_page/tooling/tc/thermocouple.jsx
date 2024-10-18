import {useState, useEffect, useRef, useContext} from "react";
import {RocketState} from "../../../Context";
import {ThermocoupleChart} from "./thermocouple-chart";

const THREE_MINUTES_IN_MS = 3 * 60 * 1000;
const FIVE_MINUTES_IN_SECONDS = 5 * 60;

export function Thermocouple() {
    const {tcs} = useContext(RocketState);

    const tcsRef = useRef(tcs);
    const intervalRef = useRef(null);

    const [running, setRunning] = useState(false);
    const [data, setData] = useState([]);

    const handleStart = () => {
        const startTime = Date.now();
        setRunning(true);

        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));

            setData((prevData) => {
                const newData = [
                    ...prevData,
                    {
                        time: elapsedSeconds,
                        Copv: tcsRef.current?.Copv
                    }
                ];

                return newData.filter(
                    (d) => d.time && d.time >= elapsedSeconds - FIVE_MINUTES_IN_SECONDS
                );
            });
        }, 1000);
    };

    const handleClear = () => {
        setData([]);
    };

    const handleStop = () => {
        setData([]);
        setRunning(false);
    };

    useEffect(() => {
        tcsRef.current = tcs;
    }, [tcs]);

    return (
        <div
            style={{
                backgroundColor: "rgb(50, 51, 56)",
                borderRadius: 10,
                padding: 12,
                fontSize: 24
            }}
        >
            <h4 style={{margin: 0}}>Thermocouple</h4>

            {!running ? (
                <button
                    onClick={handleStart}
                    style={{cursor: "pointer", fontSize: 16, width: "100%"}}
                >
                    Start Recording
                </button>
            ) : (
                <div style={{display: "flex", flexDirection: "column", fontSize: 20, gap: 12}}>
                    <div style={{height: 1, width: "100%", backgroundColor: "aqua"}} />

                    <ThermocoupleChart data={data} />

                    <div style={{width: "100%", display: "flex", gap: 8}}>
                        <button
                            onClick={handleClear}
                            style={{cursor: "pointer", fontSize: 16, width: "100%"}}
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleStop}
                            style={{cursor: "pointer", fontSize: 16, width: "100%"}}
                        >
                            Stop
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
