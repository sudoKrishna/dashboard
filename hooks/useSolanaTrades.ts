import useSWR from 'swr';
import { DeriverseSDK, Trade } from '@/lib/deriverse-sdk';
import { useDashboardStore } from './useDashboardStore';
import { useEffect } from 'react';

// Mock data generator for development
const generateMockTrades = (count: number): Trade[] => {
    return Array.from({ length: count }).map((_, i) => ({
        signature: `sig_${Math.random().toString(36).slice(2)}`,
        asset: Math.random() > 0.5 ? 'SOL-PERP' : 'BTC-PERP',
        type: Math.random() > 0.7 ? 'Spot' : 'Perp',
        entryPrice: 100 + Math.random() * 100,
        exitPrice: 100 + Math.random() * 100,
        duration: `${Math.floor(Math.random() * 60)}m`,
        pnl: (Math.random() - 0.4) * 1000,
        fees: Math.random() * 10,
        timestamp: Date.now() - Math.floor(Math.random() * 100000000),
    })).sort((a, b) => a.timestamp - b.timestamp);
};

export function useSolanaTrades(walletAddress: string | null) {
    const setTrades = useDashboardStore((state) => state.setTrades);
    const setLoading = useDashboardStore((state) => state.setLoading);

    const fetcher = async (address: string) => {
        // In real app: return DeriverseSDK.fetchTrades(address);
        // For demo: verify with mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        return generateMockTrades(50);
    };

    const { data, error, isLoading } = useSWR(
        walletAddress ? ['trades', walletAddress] : null,
        ([_, address]) => fetcher(address),
        {
            refreshInterval: 10000, // Poll every 10s
        }
    );

    useEffect(() => {
        setLoading(isLoading);
        if (data) {
            setTrades(data);
        }
    }, [data, isLoading, setTrades, setLoading]);

    return {
        trades: data,
        isLoading,
        error
    };
}
