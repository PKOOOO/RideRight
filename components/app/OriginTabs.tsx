"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * Top-level origin category tabs.
 * "Available for Import" is listed first so it's the default landing view.
 */
const ORIGIN_TABS = [
    { label: "Available for Import", value: "imported" },
    { label: "Foreign Used", value: "foreign_used" },
    { label: "Locally Used", value: "locally_used" },
] as const;

interface OriginTabsProps {
    activeOrigin: string;
}

export function OriginTabs({ activeOrigin }: OriginTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleTabClick = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (value === "all") {
                params.set("origin", "all");
            } else {
                params.set("origin", value);
            }

            router.push(`?${params.toString()}`, { scroll: false });
        },
        [router, searchParams],
    );

    return (
        <div className="flex items-center gap-1 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8">
            {/* All Cars tab */}
            <button
                type="button"
                onClick={() => handleTabClick("all")}
                className={cn(
                    "shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all",
                    activeOrigin === "all"
                        ? "bg-red-500 text-white shadow-md shadow-red-500/25"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
                )}
            >
                All Cars
            </button>

            {ORIGIN_TABS.map((tab) => (
                <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleTabClick(tab.value)}
                    className={cn(
                        "shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all",
                        activeOrigin === tab.value
                            ? "bg-red-500 text-white shadow-md shadow-red-500/25"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700",
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
