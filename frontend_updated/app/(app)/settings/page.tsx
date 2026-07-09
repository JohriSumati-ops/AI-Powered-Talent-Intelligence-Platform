"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  Server,
  Trash2,
  Moon,
  Sun,
  RefreshCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/domain/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiClient, API_BASE_URL } from "@/lib/api/client";
import { useSessionStore } from "@/lib/store/session-store";
import { useThemeStore } from "@/lib/store/theme-store";

async function fetchHealth() {
  const { data } = await apiClient.get<{ status: string; version?: string }>("/health");
  return data;
}

export default function SettingsPage() {
  const { parsedJD, candidates, rankings, clearSession } = useSessionStore();
  const { theme, setTheme } = useThemeStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const { data: health, isError, refetch, isFetching } = useQuery({
    queryKey: ["health-settings"],
    queryFn: fetchHealth,
    retry: 0,
  });

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clearSession();
    setConfirmClear(false);
    toast.success("Session cleared.");
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workspace Settings"
        title="Settings"
        description="Manage your API connection, appearance, and current session data."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <Server className="size-4" />
              Backend Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">API Base URL</p>
              <code className="block rounded-lg bg-muted/60 px-3 py-2 text-sm font-mono">
                {API_BASE_URL}
              </code>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Set via <code>NEXT_PUBLIC_API_BASE_URL</code> in your <code>.env.local</code> file.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2.5">
              <div className="flex items-center gap-2 text-sm">
                {isError ? (
                  <XCircle className="size-4 text-rose" />
                ) : (
                  <CheckCircle2 className="size-4 text-emerald" />
                )}
                <span>{isError ? "Not reachable" : `Healthy${health?.version ? ` · v${health.version}` : ""}`}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCcw className={`size-3.5 ${isFetching ? "animate-spin" : ""}`} />
                Recheck
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <SettingsIcon className="size-4" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2.5">
              <span className="text-sm">Theme</span>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant={theme === "dark" ? "primary" : "secondary"}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="size-3.5" />
                  Dark
                </Button>
                <Button
                  size="sm"
                  variant={theme === "light" ? "primary" : "secondary"}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="size-3.5" />
                  Light
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-3 sm:grid-cols-3 mb-4">
              <SessionStat label="JD parsed" value={parsedJD ? "Yes" : "No"} tone={parsedJD ? "emerald" : "default"} />
              <SessionStat label="Candidates loaded" value={String(candidates.length)} tone={candidates.length > 0 ? "emerald" : "default"} />
              <SessionStat label="Last ranking size" value={String(rankings.length)} tone={rankings.length > 0 ? "emerald" : "default"} />
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              The backend is stateless — your job description, candidate pool, and ranking
              results live only in this browser session (sessionStorage) and are cleared when
              you close the tab or clear them here.
            </p>
            <Button
              variant={confirmClear ? "destructive" : "secondary"}
              size="sm"
              onClick={handleClear}
            >
              <Trash2 className="size-4" />
              {confirmClear ? "Click again to confirm" : "Clear session data"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SessionStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "default";
}) {
  return (
    <div className="rounded-lg bg-muted/60 p-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Badge tone={tone}>{tone === "emerald" ? "Set" : "Empty"}</Badge>
      </div>
      <p className="font-display font-semibold">{value}</p>
    </div>
  );
}
