import React from "react";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden text-foreground antialiased selection:bg-gain/20 selection:text-gain font-sans">
            {/* Left Sidebar */}
            <div className="hidden md:block w-72 flex-shrink-0 border-r border-sidebar-border shadow-[4px_0_24px_-12px_rgba(0,0,0,0.5)] z-20">
                <LeftSidebar />
            </div>

            {/* Main Content (Center) */}
            <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-background/50">
                {/* Optional Header can go here */}
                <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6">
                    {children}
                </div>
            </main>

            {/* Right Sidebar */}
            <div className="hidden xl:block w-80 flex-shrink-0 border-l border-sidebar-border shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.5)] z-20">
                <RightSidebar />
            </div>
        </div>
    );
}
