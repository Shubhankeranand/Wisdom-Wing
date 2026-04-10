"use client";

import { AppShell } from "@/components/app-shell";
import { DefaultRightRail } from "@/components/right-rail";
import { FeedCard } from "@/components/feed-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { feedPosts } from "@/lib/mock-data";

export default function CommunitiesPage() {
  return (
    <AppShell
      title="Communities"
      subtitle="Structured spaces keep academic discussion focused by college, batch, and interest."
      rightRail={<DefaultRightRail />}
    >
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">My Communities</h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">My College</span>
          </div>
          {["NIT Delhi 2028", "DSA Enthusiasts", "Web Dev Club", "Placement Sprint"].map((community) => (
            <div key={community} className="rounded-lg border border-border px-4 py-3 text-sm text-textMuted">
              {community}
            </div>
          ))}
        </Card>
        <div className="space-y-4">
          <Card className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">NIT Delhi 2028 Feed</h3>
              <p className="text-sm text-textMuted">Pinned guidelines, peer help, and batch-specific updates.</p>
            </div>
            <Button variant="secondary">Joined</Button>
          </Card>
          <Card className="space-y-2 border-primary/30 bg-primary/5">
            <p className="font-medium">Community Guidelines</p>
            <p className="text-sm text-textMuted">
              Ask with context, verify factual claims, and keep resource sharing academic and respectful.
            </p>
          </Card>
          {feedPosts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
