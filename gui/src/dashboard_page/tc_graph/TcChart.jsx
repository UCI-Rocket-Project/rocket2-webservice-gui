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
                    <Tooltip
                        contentStyle={{fontSize: 24}}
                        labelStyle={{color: "black", paddingLeft: 0}}
                        labelFormatter={(label) => (
                            <p
                                style={{
                                    padding: 0,
                                    margin: 0
                                }}
                            >
                                Time: {label}
                            </p>
                        )}
                    />
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
