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
export function PressureChart({data}) {
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
                    onClick={() => handleClick("Copv")}
                >
                    Copv
                </button>
                <button
                    style={{fontSize: 16, cursor: "pointer", width: "33%"}}
                    className={styles.darkButton}
                    onClick={() => handleClick("Tanks")}
                >
                    Tanks
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
                        domain={["auto"]}
                    />
                    <YAxis domain={["auto"]} />
                    <Tooltip />
                    <Legend />
                    {dataKey === undefined || dataKey === "Copv" ? (
                        <Line
                            type="monotone"
                            dataKey="Copv"
                            stroke="#8884d8"
                            dot={false}
                            isAnimationActive={false}
                        />
                    ) : null}
                    {dataKey === undefined || dataKey === "Tanks" ? (
                        <>
                            <Line
                                type="monotone"
                                dataKey="Lox"
                                stroke="#82ca9d"
                                dot={false}
                                isAnimationActive={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="Lng"
                                stroke="#82ca9d"
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