"use client";

import { TrendingUp, Clock, Activity, Trophy } from "lucide-react";
import { useDashboardStore } from "@/hooks/useDashboardStore";
import { useTradingAnalytics } from "@/hooks/useTradingAnalytics";

export function RightSidebar() {
    const { trades } = useDashboardStore();
    const { metrics } = useTradingAnalytics(trades || []);

    const { winRate, profitFactor, avgDuration, largestWin } = metrics;

    return (
        <aside className="w-full h-full p-4 border-l border-sidebar-border bg-sidebar flex flex-col gap-6 overflow-y-auto">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Metrics</h2>

            <div className="grid gap-4">
                <MetricItem
                    label="Profit Factor"
                    value={profitFactor.toFixed(2)}
                    trend="+0.3"
                    icon={<TrendingUp className="w-4 h-4 text-gain" />}
                />
                <MetricItem
                    label="Win Rate"
                    value={`${winRate.toFixed(1)}%`}
                    trend="-2%"
                    trendColor="text-loss"
                    icon={<Trophy className="w-4 h-4 text-primary" />}
                />
                <MetricItem
                    label="Avg Duration"
                    value={`${avgDuration.toFixed(0)}m`}
                    icon={<Clock className="w-4 h-4 text-blue-400" />}
                />
                <MetricItem
                    label="Largest Win"
                    value={`$${largestWin.toFixed(0)}`}
                    valueColor="text-gain"
                    icon={<Activity className="w-4 h-4 text-gain" />}
                />
            </div>
        </aside>
    );
}

interface MetricItemProps {
    label: string;
    value: string;
    trend?: string;
    icon: React.ReactNode;
    trendColor?: string;
    valueColor?: string;
}

function MetricItem({ label, value, trend, icon, trendColor = "text-gain", valueColor = "text-foreground" }: MetricItemProps) {
    return (
        <div className="p-4 rounded-xl bg-sidebar-accent/30 border border-sidebar-border hover:bg-sidebar-accent/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-muted-foreground">{label}</span>
                {icon}
            </div>
            <div className="flex items-baseline justify-between">
                <span className={`text-xl font-bold ${valueColor}`}>{value}</span>
                {trend && <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>}
            </div>
        </div>
    )
}
