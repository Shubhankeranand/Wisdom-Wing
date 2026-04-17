"use client";

import Link from "next/link";
import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { postService } from "@/lib/services";
import { CommunityPost } from "@/lib/types";

export function PostCard({
  post,
  onVote
}: {
  post: CommunityPost & { communityId?: { name?: string } };
  onVote?: (postId: string, score: number) => void;
}) {
  const authorLabel = post.isAnonymous
    ? "Anonymous"
    : `@${post.authorId?.username ?? "user"} • ${post.authorId?.status ?? "Member"}`;

  const vote = async (value: -1 | 0 | 1) => {
    const response = await postService.vote(post._id, value);
    onVote?.(post._id, response.score);
  };

  return (
    <Card className="space-y-4">
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <button aria-label="Upvote" onClick={() => vote(1)} className="text-primary">
            <ArrowBigUp className="h-6 w-6" />
          </button>
          <span className="text-sm font-semibold">{post.score}</span>
          <button aria-label="Downvote" onClick={() => vote(-1)} className="text-textMuted">
            <ArrowBigDown className="h-6 w-6" />
          </button>
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/posts/${post._id}`} className="text-lg font-semibold hover:text-primary">
                {post.title}
              </Link>
              <Tag>{post.postType}</Tag>
            </div>
            <p className="text-xs text-textMuted">
              {authorLabel}
              {post.communityId?.name ? ` • ${post.communityId.name}` : ""}
            </p>
          </div>
          <p className="line-clamp-3 text-sm leading-6 text-textMuted">{post.content}</p>
          {post.resourceUrl ? (
            <a href={post.resourceUrl} target="_blank" className="text-sm font-medium text-primary">
              Open resource
            </a>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-textMuted">
            <MessageSquare className="h-4 w-4" />
            {post.repliesCount} replies
          </div>
        </div>
      </div>
    </Card>
  );
}
