"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PostCard } from "@/components/post-card";
import { Card } from "@/components/ui/card";
import { feedService, HomeFeedPayload } from "@/lib/services";

export default function HomePage() {
  const [feed, setFeed] = useState<HomeFeedPayload | null>(null);

  useEffect(() => {
    feedService.home().then(setFeed);
  }, []);

  const updateScore = (postId: string, score: number) => {
    setFeed((current) =>
      current
        ? {
            ...current,
            posts: current.posts.map((post) => (post._id === postId ? { ...post, score } : post))
          }
        : current
    );
  };

  return (
    <AppShell
      title="Home"
      subtitle="Personalized posts from your communities and interests."
      rightRail={
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">Top Unanswered Questions</h3>
          {!feed ? <p className="text-sm text-textMuted">Loading...</p> : null}
          {feed?.topUnansweredPosts.length ? (
            feed.topUnansweredPosts.map((post) => (
              <Link key={post._id} href={`/posts/${post._id}`} className="block rounded-lg border border-border p-3 text-sm hover:bg-surfaceAlt">
                {post.title}
              </Link>
            ))
          ) : feed ? (
            <p className="text-sm text-textMuted">No unanswered questions found.</p>
          ) : null}
        </Card>
      }
    >
      <div className="space-y-4">
        {!feed ? <Card>Loading personalized feed...</Card> : null}
        {feed?.posts.length ? (
          feed.posts.map((post) => <PostCard key={post._id} post={post} onVote={updateScore} />)
        ) : feed ? (
          <Card>
            <p className="text-sm text-textMuted">
              Join communities and select interests during onboarding to personalize your home feed.
            </p>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}
