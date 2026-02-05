import { create } from 'zustand';
import { Trade } from '@/lib/deriverse-sdk';

interface DashboardState {
    walletAddress: string | null;
    trades: Trade[];
    selectedAsset: string | null;
    isLoading: boolean;

    setWalletAddress: (address: string) => void;
    setTrades: (trades: Trade[]) => void;
    setSelectedAsset: (asset: string | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    walletAddress: null,
    trades: [],
    selectedAsset: null,
    isLoading: false,

    setWalletAddress: (address) => set({ walletAddress: address }),
    setTrades: (trades) => set({ trades }),
    setSelectedAsset: (asset) => set({ selectedAsset: asset }),
    setLoading: (loading) => set({ isLoading: loading }),
}));
