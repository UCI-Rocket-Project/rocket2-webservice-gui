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

    function getMinValue(data) {
        const allValues = data.flatMap((item) => [item.Copv]);
        return Math.min(...allValues);
    }

    const minValue =
        data.length > 0
            ? getMinValue(data) - 10 // Subtract 10 for buffer
            : 0;

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
                        domain={[0, 180]}
                    />
                    <YAxis domain={[minValue, "auto"]} />
                    <Tooltip />
                    <Legend />

                    {dataKey === undefined || dataKey === "Copv" ? (
                        <Line
                            type="monotone"
                            dataKey="Copv"
                            stroke="#8884d8"
                        />
                    ) : null}
                    {dataKey === undefined || dataKey === "Lox" ? (
                        <Line
                            type="monotone"
                            dataKey="Lox"
                            stroke="#82ca9d"
                        />
                    ) : null}
                    {dataKey === undefined || dataKey === "Lng" ? (
                        <Line
                            type="monotone"
                            dataKey="Lng"
                            stroke="#ffc658"
                        />
                    ) : null}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
