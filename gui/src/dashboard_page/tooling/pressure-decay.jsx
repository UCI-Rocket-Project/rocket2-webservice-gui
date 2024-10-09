import {useState, useEffect, useRef, useContext} from "react";
import {RocketState} from "../../Context";

const THREE_MINUTES_IN_MS = 3 * 60 * 1000;

function getFormattedTime(startTimestamp) {
    const remainingTimeInMs = THREE_MINUTES_IN_MS - (Date.now() - startTimestamp);
    const remainingTimeInSeconds = Math.floor(remainingTimeInMs / 1000);
    const minutes = Math.floor(remainingTimeInSeconds / 60);
    const seconds = remainingTimeInSeconds % 60;

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${minutes}:${formattedSeconds}`;
}

function calculateChange(startValue, endValue) {
    const difference = endValue - startValue;
    const changePerMinute = difference / 3;

    return parseFloat(changePerMinute.toFixed(2));
}

export function PressureDecay() {
    const {pts} = useContext(RocketState);

    const ptsRef = useRef(pts);

    useEffect(() => {
        ptsRef.current = pts;
    }, [pts]);

    const [running, setRunning] = useState(false);
    const [startTimestamp, setStartTimestamp] = useState(0);
    const [completedRun, setCompletedRun] = useState(false);

    const [startCopvPt, setStartCopvPt] = useState();
    const [startLoxPt, setStartLoxPt] = useState();
    const [startLngPt, setStartLngPt] = useState();

    const [endCopvPt, setEndCopvPt] = useState();
    const [endLoxPt, setEndLoxPt] = useState();
    const [endLngPt, setEndLngPt] = useState();

    const handleStart = () => {
        setRunning(true);

        setStartCopvPt(parseFloat(pts.Copv.toFixed(2)));
        setStartLoxPt(parseFloat(pts.Lox.toFixed(2)));
        setStartLngPt(parseFloat(pts.Lng.toFixed(2)));
        setStartTimestamp(Date.now());

        setTimeout(
            () => {
                setEndCopvPt(parseFloat(ptsRef.current.Copv.toFixed(2)));
                setEndLoxPt(parseFloat(ptsRef.current.Lox.toFixed(2)));
                setEndLngPt(parseFloat(ptsRef.current.Lng.toFixed(2)));

                setRunning(false);
                setCompletedRun(true);
            },
            // 5000
            THREE_MINUTES_IN_MS
        );
    };

    const handleRestart = () => {
        setStartCopvPt();
        setStartLoxPt();
        setStartLngPt();
        setStartTimestamp(0);
        setCompletedRun(false);

        handleStart();
    };

    return (
        <div
            style={{
                backgroundColor: "rgb(50, 51, 56)",
                borderRadius: 10,
                padding: 12,
                fontSize: 24
            }}
        >
            <h4 style={{margin: 0}}>Automated Pressure Decay</h4>

            {!running && !completedRun ? (
                <button
                    onClick={handleStart}
                    style={{cursor: "pointer", fontSize: 16}}
                >
                    Start Recording (3 min)
                </button>
            ) : (
                <div style={{display: "flex", flexDirection: "column", fontSize: 20, gap: 12}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <span>Initial COPV PT: {startCopvPt}</span>
                        <span>Initial LOX PT: {startLoxPt}</span>
                        <span>Initial LNG PT: {startLngPt}</span>
                    </div>

                    <div
                        style={{
                            height: 1,
                            width: "100%",
                            backgroundColor: "aqua"
                        }}
                    />

                    {running ? (
                        <p style={{padding: 0, margin: 0}}>
                            Time Remaining: {getFormattedTime(startTimestamp)}
                        </p>
                    ) : (
                        <div>
                            <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <span>End COPV PT: {endCopvPt} </span>
                                    <span>
                                        {calculateChange(startCopvPt, endCopvPt)} per minute
                                    </span>
                                </div>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <span>End LOX PT: {endLoxPt} </span>
                                    <span>{calculateChange(startLoxPt, endLoxPt)} per minute</span>
                                </div>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <span>End LNG PT: {endLngPt} </span>
                                    <span>{calculateChange(startLngPt, endLngPt)} per minute</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleRestart}
                        style={{cursor: "pointer", fontSize: 16}}
                    >
                        Restart
                    </button>
                </div>
            )}
        </div>
    );
}
