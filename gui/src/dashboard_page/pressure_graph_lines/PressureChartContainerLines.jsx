import {useState, useEffect, useRef, useContext} from "react";
import {RocketState} from "../../Context";
import { PressureChartLines } from "./PressureChartLines";

const FIVE_MINUTES_IN_SECONDS = 5 * 60;
export function PressureChartContainerLines() {
    const {pts} = useContext(RocketState);

    const ptsRef = useRef(pts);

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
                        Vent: ptsRef.current.Vent,
                        LOXMVAS: ptsRef.current.Gn2,
                        LNGMVAS: ptsRef.current.LoxMvas,
                        LOXINJ: ptsRef.current.InjectorLox,
                        LNGINJ: ptsRef.current.InjectorLng,
                        LOXINJSPARE: ptsRef.current.Two,
                        LNGINJSPARE: ptsRef.current.Three,
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
            <h4 style={{margin: 0}}>Pressures for lNG</h4>

            <PressureChartLines data={data} />
        </div>
    );
}
