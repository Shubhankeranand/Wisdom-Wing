"use client";

import { AppShell } from "@/components/app-shell";
import { DefaultRightRail } from "@/components/right-rail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AskPage() {
  return (
    <AppShell
      title="Ask a Question"
      subtitle="Intercept duplicates early, add context clearly, and keep the flow focused."
      rightRail={<DefaultRightRail />}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="space-y-5">
          <input className="w-full rounded-lg border border-border bg-bg px-4 py-4 text-lg font-semibold outline-none focus:border-primary" placeholder="What do you need help with?" />
          <div className="flex flex-wrap gap-2 text-xs text-textMuted">
            <span className="rounded-lg border border-border px-3 py-1">Bold</span>
            <span className="rounded-lg border border-border px-3 py-1">Italic</span>
            <span className="rounded-lg border border-border px-3 py-1">Code</span>
            <span className="rounded-lg border border-border px-3 py-1">Link</span>
          </div>
          <textarea className="min-h-[220px] w-full rounded-lg border border-border bg-bg px-4 py-4 outline-none focus:border-primary" placeholder="Add your context, attempts, deadlines, and what kind of answer would be most helpful." />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-lg border border-border bg-bg px-4 py-3 outline-none focus:border-primary" placeholder="Tags: DSA, OS, Placements..." />
            <label className="flex items-center justify-between rounded-lg border border-border bg-bg px-4 py-3 text-sm text-textMuted">
              Ask anonymously
              <span className="h-6 w-11 rounded-full bg-surfaceAlt" />
            </label>
          </div>
          <Button className="w-full md:w-auto">Post question</Button>
        </Card>

        <Card className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-warning">Duplicate Warning</p>
          <div className="rounded-xl border border-warning/40 bg-warning/10 p-4">
            <p className="font-medium">Similar question found</p>
            <p className="mt-2 text-sm leading-6 text-textMuted">
              “Best resources for learning DSA as a first-year student?” has 16 existing answers. Review
              it before posting.
            </p>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-border p-4">
              <p className="font-medium">Best resources for learning DSA as a first-year student?</p>
              <p className="mt-1 text-xs text-textMuted">92% semantic match</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="font-medium">DSA roadmap for tier-2 college students with limited time</p>
              <p className="mt-1 text-xs text-textMuted">84% semantic match</p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
