"use client";

import { useSolanaTrades } from "@/hooks/useSolanaTrades";
import { useTradingAnalytics } from "@/hooks/useTradingAnalytics";
import { useDashboardStore } from "@/hooks/useDashboardStore";
import { EquityCurve } from "@/components/analytics/EquityCurve";
import { TradingHeatmap } from "@/components/analytics/TradingHeatmap";
import { TradeTable } from "@/components/journal/TradeTable";
import { ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { walletAddress } = useDashboardStore(); // In real app, derived from wallet adapter
    // Mock user for now if not connected
    const dummyAddress = walletAddress || "7xKW...92a1";

    const { trades, isLoading } = useSolanaTrades(dummyAddress);
    const { cumulativePnL, metrics } = useTradingAnalytics(trades || []);

    if (isLoading && !trades?.length) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
    }

    const { totalPnL, winRate, maxDrawdown, profitFactor } = metrics;
    const isPositive = totalPnL >= 0;

    return (
        <div className="flex flex-col gap-6 h-full text-foreground">
            {/* Header Section */}
            <div className="flex items-end justify-between border-b border-border/50 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics Terminal</h1>
                    <p className="text-sm text-muted-foreground">Deriverse Protocol • SOL-PERP</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-gain animate-pulse"></span>
                    <span className="text-xs font-mono text-gain">RPC: LIVE</span>
                </div>
            </div>

            {/* Equity Curve Component */}
            <section className="min-h-[300px] w-full bg-card/50 rounded-2xl border border-border p-1 relative overflow-hidden group flex flex-col">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

                <div className="p-4 flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Cumulative PnL</h3>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className={`text-3xl font-bold font-mono tracking-tight ${isPositive ? 'text-foreground' : 'text-loss'}`}>
                                ${Math.abs(totalPnL).toFixed(2)}
                            </span>
                            <span className={`text-sm font-medium flex items-center ${isPositive ? 'text-gain' : 'text-loss'}`}>
                                {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                {isPositive ? "+" : "-"}{((Math.abs(totalPnL) / 1000) * 10).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4 text-xs font-medium bg-secondary/30 p-2 rounded-lg">
                        <div className="text-center">
                            <p className="text-muted-foreground">Win Rate</p>
                            <p className="text-foreground">{winRate.toFixed(1)}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-muted-foreground">Max DD</p>
                            <p className="text-loss">${maxDrawdown.toFixed(0)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-0 pl-0">
                    <EquityCurve data={cumulativePnL} />
                </div>
            </section>

            {/* Grid: Heatmap + Journal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-0">
                {/* Trading Heatmap */}
                <section className="min-h-[250px] rounded-2xl border border-border bg-card/30 p-6 flex flex-col">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Hourly Performance</h3>
                    <div className="flex-1 w-full">
                        <TradingHeatmap data={trades || []} />
                    </div>
                </section>


            </div>



            <section className="min-h-[200px] rounded-2xl border border-border bg-card/30 p-6 flex flex-col">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Trading Heatmap</h3>
                <div className="flex-1 w-full">
                    <TradingHeatmap data={trades || []} />
                </div>
            </section>

            <section className="flex-1 min-h-[400px] rounded-2xl border border-border bg-card/30 p-0 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border bg-secondary/30 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-sm font-medium text-foreground">Trading Journal</h3>
                    <button className="text-xs text-primary hover:underline">Export CSV</button>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                    <TradeTable data={trades || []} />
                </div>
            </section>
        </div>
    );
}
