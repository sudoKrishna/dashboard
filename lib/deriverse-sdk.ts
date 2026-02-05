export interface Trade {
  signature: string;
  asset: string;
  type: 'Spot' | 'Perp' | 'Option';
  entryPrice: number;
  exitPrice: number;
  duration: string;
  pnl: number;
  fees: number;
  timestamp: number;
}

export const DeriverseSDK = {
  fetchTrades: async (walletAddress: string): Promise<Trade[]> => {
    // Mock implementation
    console.log(`Fetching trades for ${walletAddress}`);
    return [];
  }
};
