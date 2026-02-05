"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface EquityCurveProps {
    data: any[];
}

export function EquityCurve({ data }: EquityCurveProps) {
    const chartData = useMemo(() => {
        return data.map((d: { pnl: number;[key: string]: any }) => ({
            ...d,
            color: d.pnl >= 0 ? 'var(--gain)' : 'var(--loss)'
        }));
    }, [data]);

    const isProfitable = (data[data.length - 1]?.pnl || 0) >= 0;

    return (
        <div className="w-full h-full min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isProfitable ? "var(--gain)" : "var(--loss)"} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={isProfitable ? "var(--gain)" : "var(--loss)"} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.1} />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        tickFormatter={(val) => `$${val}`}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-popover border border-border p-3 rounded-lg shadow-xl text-xs">
                                        <p className="text-muted-foreground mb-1">{d.date}</p>
                                        <p className="text-foreground font-bold text-lg mb-1">
                                            ${d.pnl.toFixed(2)}
                                        </p>
                                        <p className={`font-mono ${d.tradePnL >= 0 ? "text-gain" : "text-loss"}`}>
                                            {d.tradePnL >= 0 ? "+" : ""}{d.tradePnL.toFixed(2)} (Trade)
                                        </p>
                                        <p className="text-muted-foreground mt-1">DD: ${d.drawdown.toFixed(2)}</p>
                                    </div>
                                )
                            }
                            return null;
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="pnl"
                        stroke={isProfitable ? "var(--gain)" : "var(--loss)"}
                        fillOpacity={1}
                        fill="url(#colorPnL)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
