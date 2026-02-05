"use client";

import { useMemo } from "react";
import { Trade } from "@/lib/deriverse-sdk";

interface TradingHeatmapProps {
    data: Trade[];
}

export function TradingHeatmap({ data }: TradingHeatmapProps) {
    // Group by Day (Row) and Hour (Col)
    // Simplify: Just show last 7 days vs 24 hours
    // Or just a grid of recent trade sessions

    // For this demo: "Profit by Hour of Day" (0-23)
    const stats = useMemo(() => {
        const hours = Array(24).fill(0).map(() => ({ pnl: 0, count: 0 }));

        data.forEach(t => {
            const date = new Date(t.timestamp);
            const hour = date.getHours();
            hours[hour].pnl += (t.pnl - t.fees);
            hours[hour].count += 1;
        });

        // Normalize for color intensity
        const maxPnL = Math.max(...hours.map(h => Math.abs(h.pnl)));

        return hours.map((h, i) => ({
            hour: i,
            ...h,
            intensity: maxPnL === 0 ? 0 : h.pnl / maxPnL
        }));
    }, [data]);

    return (
        <div className="w-full h-full overflow-x-auto">
            <div className="min-w-[600px] flex flex-col gap-2">
                <div className="flex justify-between items-end border-b border-border pb-2">
                    <span className="text-xs text-muted-foreground">00:00</span>
                    <span className="text-xs text-muted-foreground">06:00</span>
                    <span className="text-xs text-muted-foreground">12:00</span>
                    <span className="text-xs text-muted-foreground">18:00</span>
                    <span className="text-xs text-muted-foreground">23:00</span>
                </div>
                <div className="grid grid-cols-24 gap-1 h-24">
                    {stats.map((stat) => (
                        <div
                            key={stat.hour}
                            className={`rounded-sm transition-all hover:scale-110 hover:z-10 cursor-pointer group relative ${stat.count === 0 ? 'bg-muted/10' : ''
                                }`}
                            style={{
                                backgroundColor: stat.count === 0 ? undefined :
                                    stat.pnl > 0 ? `rgba(16, 185, 129, ${0.2 + stat.intensity * 0.8})` :
                                        `rgba(244, 63, 94, ${0.2 + Math.abs(stat.intensity) * 0.8})`
                            }}
                        >
                            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-popover border border-border rounded shadow-xl whitespace-nowrap z-20 text-xs">
                                <p className="font-bold text-foreground">Hour: {stat.hour}:00</p>
                                <p className={stat.pnl >= 0 ? 'text-gain' : 'text-loss'}>PnL: ${stat.pnl.toFixed(2)}</p>
                                <p className="text-muted-foreground">{stat.count} trades</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                    <span>Low Activity</span>
                    <span>High Activity</span>
                </div>
            </div>
        </div>
    );
}
