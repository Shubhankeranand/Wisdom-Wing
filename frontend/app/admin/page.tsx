"use client";

import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <AppShell
      title="Admin Panel"
      subtitle="A dense moderation surface for verifications, flagged content, and AI oversight."
      rightRail={
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">AI Moderation Logs</h3>
          <p className="text-sm text-textMuted">Blocked post for explicit language</p>
          <p className="text-sm text-textMuted">Flagged AI answer after 6 downvotes</p>
          <p className="text-sm text-textMuted">Escalated suspicious college ID upload</p>
        </Card>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Pending Verifications", "27"],
          ["Flagged Posts", "9"],
          ["Active Users", "1,842"]
        ].map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-textMuted">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold">Verification Queue</h3>
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 rounded-lg border border-border bg-bg px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-textMuted">
            <span>User</span>
            <span>College</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          {["Rahul Jain", "Isha Sethi", "Varun Kapoor"].map((name) => (
            <div
              key={name}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 rounded-lg border border-border px-4 py-4 text-sm"
            >
              <span>{name}</span>
              <span>NIT Delhi</span>
              <span className="text-warning">Pending</span>
              <span className="text-primary">Review</span>
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold">Active Review</h3>
          <div className="rounded-xl border border-border bg-bg p-6 text-center text-sm text-textMuted">
            College ID preview area
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <button className="rounded-lg bg-success px-4 py-3 font-semibold text-slate-900">Approve</button>
            <button className="rounded-lg bg-rose-500 px-4 py-3 font-semibold text-white">Reject</button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
