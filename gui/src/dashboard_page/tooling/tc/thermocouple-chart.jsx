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

export function ThermocoupleChart({data}) {
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
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
