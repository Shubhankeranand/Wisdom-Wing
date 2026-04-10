"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Command, MoonStar, Plus, Search, SunMedium } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { leftNav } from "@/lib/mock-data";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AppShell({
  title,
  subtitle,
  children,
  rightRail
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  rightRail?: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-text">
            Wisdom Wing
          </Link>
          <div className="hidden flex-1 items-center gap-3 rounded-xl border border-border bg-surfaceAlt px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-textMuted" />
            <span className="text-sm text-textMuted">Search questions, people, and resources</span>
            <span className="ml-auto inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-textMuted">
              <Command className="h-3 w-3" />K
            </span>
          </div>
          <Button className="hidden md:inline-flex">
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-lg border border-border bg-surface p-2 text-text transition hover:bg-surfaceAlt"
          >
            {theme === "light" ? <MoonStar className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
          </button>
          <button className="rounded-lg border border-border bg-surface p-2 text-text transition hover:bg-surfaceAlt">
            <Bell className="h-4 w-4" />
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
                {(user.displayName ?? user.email ?? "WW").slice(0, 2).toUpperCase()}
              </div>
              <Button
                variant="ghost"
                onClick={async () => {
                  await logout();
                  router.push("/auth/login");
                }}
              >
                Log out
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="secondary">Log in</Button>
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_minmax(0,1fr)_300px] lg:px-6">
        <aside className="hidden lg:block">
          <Card className="sticky top-24 space-y-3 p-4">
            {leftNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-textMuted transition hover:bg-surfaceAlt hover:text-text"
              >
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </Card>
        </aside>

        <section className="space-y-5">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-textMuted">{subtitle}</p>
          </div>
          {children}
        </section>

        <aside className="space-y-4">{rightRail}</aside>
      </main>
    </div>
  );
}
