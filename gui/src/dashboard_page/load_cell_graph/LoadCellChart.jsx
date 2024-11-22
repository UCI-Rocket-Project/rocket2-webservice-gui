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

export function LoadCellChart({data}) {
    return (
        <div style={{display: "flex", flexDirection: "column", gap: 8}}>
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
                        labelFormatter={(label) => (
                                <>Time: {label}</>
                        )}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="force"
                        stroke="#FF0000"
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
