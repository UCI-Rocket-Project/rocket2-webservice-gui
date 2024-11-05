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

export function TcChart({data}) {
    return (
        <div style={{display: "flex", flexDirection: "column", gap: 8}}>
            <ResponsiveContainer
                width="100%"
                height={400}
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
                    <Tooltip />
                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="Copv"
                        stroke="#FF0000"
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
