"use client";

import { AppShell } from "@/components/app-shell";
import { DefaultRightRail } from "@/components/right-rail";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";

export default function ProfilePage() {
  return (
    <AppShell
      title="Profile"
      subtitle="An academic identity that highlights answers, resources, and trusted participation."
      rightRail={<DefaultRightRail />}
    >
      <Card className="overflow-hidden p-0">
        <div className="h-40 bg-gradient-to-r from-primary via-accentAlt to-accent" />
        <div className="space-y-5 p-6">
          <div className="-mt-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-surface bg-bg text-2xl font-bold">
                AV
              </div>
              <div>
                <h2 className="text-3xl font-bold">Aditi Verma</h2>
                <p className="text-sm text-textMuted">Verified • Final Year • Placement Mentor</p>
              </div>
            </div>
            <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium">Edit Profile</button>
          </div>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <Card className="space-y-4 bg-bg">
              <div>
                <p className="text-sm font-semibold">Bio</p>
                <p className="mt-2 text-sm leading-6 text-textMuted">
                  Helping students navigate placements, peer mock interviews, and frontend portfolios.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag>React</Tag>
                <Tag>Resume Review</Tag>
                <Tag>Interview Prep</Tag>
              </div>
              <div className="grid gap-2 text-sm text-textMuted">
                <p>Karma: 1,280</p>
                <p>Answers Accepted: 34</p>
                <p>Resources Shared: 19</p>
              </div>
            </Card>
            <Card className="space-y-5">
              <div className="flex gap-3 text-sm">
                <span className="rounded-full bg-primary px-3 py-1 text-white">Activity</span>
                <span className="rounded-full border border-border px-3 py-1 text-textMuted">Questions</span>
                <span className="rounded-full border border-border px-3 py-1 text-textMuted">Answers</span>
                <span className="rounded-full border border-border px-3 py-1 text-textMuted">Resources</span>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-border p-4">
                  <p className="font-medium">Shared a frontend interview checklist for 2026 placement cycle</p>
                  <p className="mt-1 text-sm text-textMuted">2 hours ago • Resource</p>
                </div>
                <div className="rounded-xl border border-border p-4">
                  <p className="font-medium">Answered: “How do I prepare for OAs with limited time?”</p>
                  <p className="mt-1 text-sm text-textMuted">Yesterday • 54 upvotes</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
