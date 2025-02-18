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

export function PressureDecayChart({data}) {
    const [dataKey, setDatakey] = useState();

    const handleClick = (input) => {
        setDatakey(input);
    };

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 8}}>
            <div
                style={{
                    display: "grid",
                    gap: 4,
                    gridTemplateColumns: "repeat(4, 1fr)"
                }}
            >
                <button
                    style={{fontSize: 16, cursor: "pointer"}}
                    onClick={() => handleClick()}
                >
                    All
                </button>
                <button
                    style={{fontSize: 16, cursor: "pointer"}}
                    onClick={() => handleClick("Copv")}
                >
                    Copv
                </button>
                <button
                    style={{fontSize: 16, cursor: "pointer"}}
                    onClick={() => handleClick("Lox")}
                >
                    Lox
                </button>
                <button
                    style={{fontSize: 16, cursor: "pointer"}}
                    onClick={() => handleClick("Lng")}
                >
                    Lng
                </button>
            </div>

            <ResponsiveContainer
                width="100%"
                height={300}
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
                    {dataKey === undefined || dataKey === "Lox" ? (
                        <Line
                            type="monotone"
                            dataKey="Lox"
                            stroke="#82ca9d"
                            dot={false}
                            isAnimationActive={false}
                        />
                    ) : null}
                    {dataKey === undefined || dataKey === "Lng" ? (
                        <Line
                            type="monotone"
                            dataKey="Lng"
                            stroke="#ffc658"
                            dot={false}
                            isAnimationActive={false}
                        />
                    ) : null}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
