"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FileText,
  ListOrdered,
  ScanSearch,
  Users2,
  Sparkles,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  BrainCircuit,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/jd-parser", label: "Job Parser", icon: FileText },
  { href: "/ranking", label: "Candidate Ranking", icon: ListOrdered },
  { href: "/retrieval", label: "Semantic Retrieval", icon: ScanSearch },
  { href: "/compare", label: "Candidate Comparison", icon: Users2 },
  { href: "/chat", label: "Recruiter AI", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col shrink-0 border-r border-border bg-surface/60 backdrop-blur transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-64"
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 px-5 h-16 border-b border-border shrink-0"
      >
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
          <BrainCircuit className="size-4.5" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display font-semibold text-sm">
              Talent Intelligence
            </p>
            <p className="text-[10px] tracking-widest text-muted-foreground">
              ENGINE
            </p>
          </div>
        )}
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p
          className={cn(
            "px-2 mb-2 text-[10px] font-medium tracking-widest text-muted-foreground",
            collapsed && "text-center"
          )}
        >
          {collapsed ? "—" : "WORKSPACE"}
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r bg-primary" />
                  )}
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <p
          className={cn(
            "px-2 mb-2 text-[10px] font-medium tracking-widest text-muted-foreground",
            collapsed && "text-center"
          )}
        >
          {collapsed ? "—" : "WORKSPACE SETTINGS"}
        </p>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-primary-muted text-foreground font-medium"
              : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
          )}
        >
          <Settings className="size-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          {collapsed ? (
            <ChevronsRight className="size-4 shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="size-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
