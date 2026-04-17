"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, MoonStar, Plus, SunMedium } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { GlobalSearch } from "@/components/global-search";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Communities", href: "/communities" }
];

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
  const { user, appUser, loading, logout } = useAuth();
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (appUser && !appUser.onboardingCompleted) {
      router.replace("/onboarding");
    }
  }, [appUser, loading, router, user]);

  if (loading || !user || (appUser && !appUser.onboardingCompleted)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-sm text-textMuted">
        Loading Wisdom Wing...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 lg:px-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-text">
            Wisdom Wing
          </Link>
          <GlobalSearch />
          <Link href="/communities" className="hidden md:inline-flex">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Join Community
          </Button>
          </Link>
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
            <div className="relative">
              <button
                aria-label="Open profile menu"
                onClick={() => setProfileMenuOpen((current) => !current)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white"
              >
                {(appUser?.fullName ?? user.displayName ?? user.email ?? "WW").slice(0, 2).toUpperCase()}
              </button>
              {profileMenuOpen ? (
                <div className="absolute right-0 top-12 z-40 w-48 rounded-xl border border-border bg-surface p-2 shadow-soft">
                  <button
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-textMuted hover:bg-surfaceAlt hover:text-text"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/dashboard");
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-textMuted hover:bg-surfaceAlt hover:text-text"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      router.push("/dashboard#account-settings");
                    }}
                  >
                    Settings
                  </button>
                  {appUser?.roles?.includes("admin") ? (
                    <button
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-textMuted hover:bg-surfaceAlt hover:text-text"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        router.push("/admin");
                      }}
                    >
                      Admin
                    </button>
                  ) : null}
                  {appUser?.roles?.includes("superadmin") ? (
                    <button
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-textMuted hover:bg-surfaceAlt hover:text-text"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        router.push("/superadmin");
                      }}
                    >
                      Superadmin
                    </button>
                  ) : null}
                  <button
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-500 hover:bg-rose-500/10"
                    onClick={async () => {
                      await logout();
                      router.push("/auth/login");
                    }}
                  >
                    Log out
                  </button>
                </div>
              ) : null}
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
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-textMuted transition hover:bg-surfaceAlt hover:text-text"
              >
                <span>{item.label}</span>
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
