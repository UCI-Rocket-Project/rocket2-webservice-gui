import {useState, useEffect, useRef, useContext} from "react";
import {RocketState} from "../../Context";
import {TcChart} from "./TcChart";

const FIVE_MINUTES_IN_SECONDS = 5 * 60;

export function TcChartContainer() {
    const {tcs} = useContext(RocketState);

    const tcsRef = useRef(tcs);
    const intervalRef = useRef(null);

    const [data, setData] = useState([]);

    useEffect(() => {
        const startTime = Date.now();
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
    }, []);

    useEffect(() => {
        tcsRef.current = tcs;
    }, [tcs]);

    return (
        <div
            style={{
                borderRadius: 10,
                padding: 12,
                fontSize: 24
            }}
        >
            <h4 style={{margin: 0}}>COPV TC</h4>
            <div style={{display: "flex", flexDirection: "column", fontSize: 20, gap: 12}}>
                <div style={{height: 1, width: "100%", backgroundColor: "aqua"}} />

                <TcChart data={data} />
            </div>
        </div>
    );
}
