"use client";

import { Search, Moon, Sun, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useThemeStore } from "@/lib/store/theme-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

async function fetchHealth() {
  const { data } = await apiClient.get<{ status: string }>("/health");
  return data;
}

export function Topbar() {
  const { theme, toggleTheme } = useThemeStore();

  const { data, isError } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: 0,
    refetchInterval: 30_000,
  });

  const connected = !isError && data?.status === "healthy";

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search candidates, jobs, reports..."
          className="h-10 w-full rounded-lg border border-border bg-muted/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Badge tone={connected ? "emerald" : "rose"}>
          <span
            className={cn(
              "size-1.5 rounded-full",
              connected ? "bg-emerald" : "bg-rose"
            )}
          />
          {connected ? "Connected" : "Offline"}
        </Badge>

        <button
          onClick={toggleTheme}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>

        <button
          className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
        </button>

        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          AK
        </div>
      </div>
    </header>
  );
}
