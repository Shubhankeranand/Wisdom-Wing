"use client";

import { AppShell } from "@/components/app-shell";
import { QuestionSearch } from "@/components/question-search";
import { DefaultRightRail } from "@/components/right-rail";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { searchResults } from "@/lib/mock-data";

export default function SearchPage() {
  return (
    <AppShell
      title="Search"
      subtitle="Keyword and semantic search share one focused page so students can find what they meant, not just what they typed."
      rightRail={<DefaultRightRail />}
    >
      <Card className="space-y-4">
        <input className="w-full rounded-lg border border-border bg-bg px-4 py-4 text-lg outline-none focus:border-primary" defaultValue="DSA resources" />
        <div className="flex flex-wrap gap-2">
          <Tag>Type: All</Tag>
          <Tag>Tags</Tag>
          <Tag>Date</Tag>
          <Tag>My College</Tag>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="rounded-full bg-primary px-3 py-1 text-white">Keyword Match</span>
          <span className="rounded-full border border-border px-3 py-1 text-textMuted">Semantic Match</span>
        </div>
      </Card>
      <QuestionSearch />
      <div className="space-y-4">
        {searchResults.map((result) => (
          <Card key={result.id} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{result.type}</p>
            <h3 className="text-xl font-semibold">{result.title}</h3>
            <p className="text-sm leading-6 text-textMuted">{result.description}</p>
            <p className="text-xs text-textMuted">{result.meta}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
