import {useState, useEffect, useRef, useContext} from "react";
import {RocketState} from "../../Context";
import {PressureChart} from "./PressureChart";

const THREE_MINUTES_IN_MS = 3 * 60 * 1000;
export function PressureChartContainer() {
    const {pts} = useContext(RocketState);

    const ptsRef = useRef(pts);
    const intervalRef = useRef(null);

    const [data, setData] = useState([]);

    useEffect(() => {
        handleStart();
    }, []);
    const handleStart = () => {
        const startTime = Date.now();

        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));

            setData((prevData) => [
                ...prevData,
                {
                    time: elapsedSeconds,
                    Copv: ptsRef.current.Copv,
                    Lox: ptsRef.current.Lox,
                    Lng: ptsRef.current.Lng
                }
            ]);
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalRef.current);
        }, THREE_MINUTES_IN_MS);
    };

    useEffect(() => {
        ptsRef.current = pts;
    }, [pts]);

    return (
        <div
            style={{
                borderRadius: 10,
                padding: 12,
                fontSize: 24
            }}
        >
            <h4 style={{margin: 0}}>Pressures</h4>

            <PressureChart data={data} />
        </div>
    );
}
