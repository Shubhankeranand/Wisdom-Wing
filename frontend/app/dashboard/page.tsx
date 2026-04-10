"use client";

import { AppShell } from "@/components/app-shell";
import { FeedCard } from "@/components/feed-card";
import { DefaultRightRail } from "@/components/right-rail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { feedPosts } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <AppShell
      title="Home Feed"
      subtitle="A clean, college-first dashboard for questions, mentors, and academic momentum."
      rightRail={<DefaultRightRail />}
    >
      <Card className="space-y-4">
        <p className="text-sm font-medium text-textMuted">Quick Ask</p>
        <div className="rounded-xl border border-border bg-bg px-4 py-4 text-sm text-textMuted">
          Ask your doubt, describe your context, and let duplicate detection suggest existing answers.
        </div>
        <div className="flex gap-3">
          <Button>Ask a question</Button>
          <Button variant="secondary">Share a resource</Button>
        </div>
      </Card>
      <div className="space-y-4">
        {feedPosts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </AppShell>
  );
}
