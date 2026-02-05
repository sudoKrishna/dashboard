import { Wallet, Settings, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LeftSidebar() {
    return (
        <aside className="w-full h-full p-4 border-r border-sidebar-border bg-sidebar flex flex-col gap-6">
            {/* Wallet Summary */}
            <div className="space-y-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Wallet</h2>
                <div className="p-4 rounded-xl bg-sidebar-accent/50 border border-sidebar-border backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-sidebar-primary/10 rounded-lg">
                            <Wallet className="w-5 h-5 text-sidebar-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Solana Wallet</p>
                            <p className="text-xs text-muted-foreground font-mono">7xKW...92a1</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-2xl font-bold text-foreground">$124,592</p>
                        <span className="text-xs font-medium text-gain">+2.4%</span>
                    </div>
                </div>
            </div>

            {/* Long/Short Bias Gauge (Stub) */}
            <div className="space-y-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Market Bias</h2>
                <div className="h-24 rounded-xl bg-sidebar-accent/50 border border-sidebar-border flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Long/Short Gauge</span>
                </div>
            </div>

            {/* Asset Filter */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assets</h2>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Filter className="w-3 h-3" />
                    </Button>
                </div>
                <div className="space-y-1">
                    {['SOL-PERP', 'BTC-PERP', 'ETH-PERP', 'JUP-SPOT'].map((asset) => (
                        <button key={asset} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent transition-colors flex justify-between items-center group">
                            <span className="text-muted-foreground group-hover:text-foreground">{asset}</span>
                            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">View</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-auto">
                <Button variant="outline" className="w-full justify-start gap-2 text-muted-foreground">
                    <Settings className="w-4 h-4" />
                    Settings
                </Button>
            </div>
        </aside>
    );
}
