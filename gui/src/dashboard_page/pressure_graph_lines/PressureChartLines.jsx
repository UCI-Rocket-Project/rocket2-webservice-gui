import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import {useState} from "react";
import styles from "../DashboardPage.module.css";

export function PressureChartLines({data}) {
    const [dataKey, setDatakey] = useState();

    const handleClick = (input) => {
        setDatakey(input);
    };

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 8}}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <button
                    style={{fontSize: 16, cursor: "pointer", width: "33%"}}
                    className={styles.darkButton}
                    onClick={() => handleClick()}
                >
                    All
                </button>
                <button
                    style={{fontSize: 16, cursor: "pointer", width: "33%"}}
                    className={styles.darkButton}
                    onClick={() => handleClick("Vent")}
                >
                    Vent
                </button>
                <button
                    style={{fontSize: 16, cursor: "pointer", width: "33%"}}
                    className={styles.darkButton}
                    onClick={() => handleClick("Lox Lines")}
                >
                    Lines
                </button>
            </div>

            <ResponsiveContainer
                width="100%"
                height={500}
            >
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        type="number"
                        domain={
                            data.length > 2 ? [data[0].time, data[data.length - 1].time] : ["auto"]
                        }
                    />
                    <YAxis domain={["auto"]} />
                    <Tooltip
                        contentStyle={{fontSize: 24}}
                        labelStyle={{color: "black", paddingLeft: 0}}
                        labelFormatter={(label) => <>Time: {label}</>}
                    />
                    <Legend />
                    {dataKey === undefined || dataKey === "Vent" ? (
                        <Line
                            type="monotone"
                            dataKey="Vent"
                            stroke="#FF0000"
                            dot={false}
                            isAnimationActive={false}
                        />
                    ) : null}
                    {dataKey === undefined || dataKey === "Lox Lines" ? (
                        <>
                            <Line
                                type="monotone"
                                dataKey="LoxIngTee"
                                stroke="#82ca9d"
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="LoxMvas"
                                stroke="#fede00"
                                dot={false}
                                isAnimationActive={false}
                            />
                        </>
                    ) : null}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
