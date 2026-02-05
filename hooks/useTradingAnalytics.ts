import { useMemo } from 'react';
import { Trade } from '@/lib/deriverse-sdk';

export function useTradingAnalytics(trades: Trade[]) {
    return useMemo(() => {
        if (!trades.length) {
            return {
                cumulativePnL: [],
                metrics: {
                    totalPnL: 0,
                    winRate: 0,
                    profitFactor: 0,
                    maxDrawdown: 0,
                    sharpeRatio: 0,
                    avgDuration: 0,
                    largestWin: 0,
                    largestLoss: 0,
                },
                heatmap: []
            };
        }

        let runningPnL = 0;
        let peakPnL = 0;
        let maxDrawdown = 0;
        let wins = 0;
        let totalGrossProfit = 0;
        let totalGrossLoss = 0;
        let totalDurationInfo = 0;

        const cumulativePnL = trades.map(t => {
            const netPnL = t.pnl - t.fees;
            runningPnL += netPnL;

            // Drawdown calc (Absolute $ drawdown from peak)
            if (runningPnL > peakPnL) peakPnL = runningPnL;
            const dd = peakPnL - runningPnL;
            if (dd > maxDrawdown) maxDrawdown = dd;

            if (netPnL > 0) {
                wins++;
                totalGrossProfit += netPnL;
            } else {
                totalGrossLoss += Math.abs(netPnL);
            }

            // Parse duration usually "Xm" or "Xh"
            // Simplified: assume mock data uses minutes just for avg calc
            // In real app, parse duration string properly
            totalDurationInfo += parseInt(t.duration) || 0;

            return {
                timestamp: t.timestamp,
                date: new Date(t.timestamp).toLocaleDateString(),
                pnl: runningPnL,
                tradePnL: netPnL,
                drawdown: dd
            };
        });

        const winRate = (wins / trades.length) * 100;
        const profitFactor = totalGrossLoss === 0 ? totalGrossProfit : totalGrossProfit / totalGrossLoss;

        // Sharpe Ratio (Simplified Daily)
        // 1. Group by day
        // 2. Calculate daily mean and std dev
        // 3. Annualize
        // For now, just using per-trade sharpe for simplicity stub
        const pnlValues = trades.map(t => t.pnl - t.fees);
        const meanPnL = pnlValues.reduce((a, b) => a + b, 0) / pnlValues.length;
        const variance = pnlValues.reduce((a, b) => a + Math.pow(b - meanPnL, 2), 0) / pnlValues.length;
        const stdDev = Math.sqrt(variance);
        const sharpeRatio = stdDev === 0 ? 0 : (meanPnL / stdDev); // Not annualized, raw per-trade

        return {
            cumulativePnL,
            metrics: {
                totalPnL: runningPnL,
                winRate,
                profitFactor,
                maxDrawdown, // In $
                sharpeRatio,
                avgDuration: totalDurationInfo / trades.length,
                largestWin: Math.max(...pnlValues),
                largestLoss: Math.min(...pnlValues),
            },
            heatmap: [] // TODO: Implement heatmap grouping if needed
        };
    }, [trades]);
}
