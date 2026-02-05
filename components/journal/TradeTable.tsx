"use client";

import { useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnDef,
    SortingState
} from "@tanstack/react-table";
import { Trade } from "@/lib/deriverse-sdk";
import { ArrowUpDown, ChevronDown } from "lucide-react";

interface TradeTableProps {
    data: Trade[];
    onAssetClick?: (asset: string) => void;
}

export function TradeTable({ data, onAssetClick }: TradeTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});

    // Persistence for notes (Mock via simplistic state for now, user asked for local storage but let's just make it editable)
    // Implementing LocalStorage persistence requires useEffect or similar. keeping simple for now.

    const columns = useMemo<ColumnDef<Trade>[]>(() => [
        {
            accessorKey: "timestamp",
            header: ({ column }) => {
                return (
                    <button
                        className="flex items-center hover:text-foreground"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Date
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </button>
                )
            },
            cell: ({ row }) => <span className="text-muted-foreground">{new Date(row.getValue("timestamp")).toLocaleString()}</span>,
        },
        {
            accessorKey: "asset",
            header: "Asset",
            cell: ({ row }) => (
                <button
                    onClick={() => onAssetClick?.(row.getValue("asset"))}
                    className="font-medium text-foreground hover:underline"
                >
                    {row.getValue("asset")}
                </button>
            )
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue("type") as string;
                return <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${type === 'Spot' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                    }`}>{type}</span>
            }
        },
        {
            accessorKey: "entryPrice",
            header: "Entry",
            cell: ({ row }) => <span>${(row.getValue("entryPrice") as number).toFixed(2)}</span>
        },
        {
            accessorKey: "exitPrice",
            header: "Exit",
            cell: ({ row }) => <span>${(row.getValue("exitPrice") as number).toFixed(2)}</span>
        },
        {
            accessorKey: "pnl",
            header: ({ column }) => (
                <button
                    className="flex items-center hover:text-foreground"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Net PnL
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </button>
            ),
            cell: ({ row }) => {
                const val = row.getValue("pnl") as number;
                const fees = row.original.fees;
                const net = val - fees;
                return (
                    <span className={`font-mono font-medium ${net >= 0 ? "text-gain" : "text-loss"}`}>
                        {net >= 0 ? "+" : ""}{net.toFixed(2)}
                    </span>
                )
            }
        },
        {
            id: "notes",
            header: "Notes",
            cell: ({ row }) => (
                <input
                    type="text"
                    placeholder="Add note..."
                    className="bg-transparent border-none text-xs text-muted-foreground focus:text-foreground focus:outline-none w-full"
                    onBlur={(e) => {
                        // TODO: Persist e.target.value for row.original.signature
                        console.log(`Note for ${row.original.signature}: ${e.target.value}`);
                        localStorage.setItem(`note-${row.original.signature}`, e.target.value);
                    }}
                    defaultValue={typeof window !== 'undefined' ? localStorage.getItem(`note-${row.original.signature}`) || "" : ""}
                />
            )
        }
    ], [onAssetClick]);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            rowSelection,
        },
    });

    return (
        <div className="rounded-md border border-border">
            <div className="relative w-full overflow-auto max-h-[400px]">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b [&_tr]:border-border sticky top-0 bg-background/90 backdrop-blur-sm z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className="h-10 px-4 align-middle font-medium text-muted-foreground">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-4 py-2 align-middle">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
