import {useState, useEffect, useRef, useContext} from "react";
import {RocketState} from "../../Context";
import {LoadCellChart} from "./LoadCellChart";

const FIVE_MINUTES_IN_SECONDS = 5 * 60;
export function LoadCellChartContainer() {
    const {misc} = useContext(RocketState);

    const miscRef = useRef(misc);

    const [data, setData] = useState([]);

    useEffect(() => {
        const startTime = Date.now();

        const intervalId = setInterval(() => {
            const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startTime) / 1000));

            setData((prevData) => {
                const newData = [
                    ...prevData,
                    {
                        time: elapsedSeconds,
                        force: miscRef.current.total_force
                    }
                ];

                return newData.filter(
                    (d) => d.time && d.time >= elapsedSeconds - FIVE_MINUTES_IN_SECONDS
                );
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        miscRef.current = misc;
    }, [misc]);

    return (
        <div
            style={{
                borderRadius: 10,
                padding: 12,
                fontSize: 24
            }}
        >
            <h4 style={{margin: 0}}>Load Cell{miscRef.current.force}</h4>

            <LoadCellChart data={data} />
        </div>
    );
}
