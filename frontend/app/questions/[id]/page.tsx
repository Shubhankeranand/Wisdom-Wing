"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { apiFetch } from "@/lib/api";

type QuestionPayload = {
  question: {
    _id: string;
    title: string;
    body: string;
    tags: string[];
    answersCount: number;
    upvotes: number;
  };
};

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const [payload, setPayload] = useState<QuestionPayload | null>(null);

  useEffect(() => {
    apiFetch<QuestionPayload>(`/api/questions/${params.id}`).then(setPayload);
  }, [params.id]);

  return (
    <AppShell title="Question Detail" subtitle="Read the full question and future answers.">
      {!payload ? (
        <Card>Loading question...</Card>
      ) : (
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold">{payload.question.title}</h2>
          <p className="leading-7 text-textMuted">{payload.question.body}</p>
          <div className="flex flex-wrap gap-2">
            {payload.question.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <p className="text-sm text-textMuted">
            {payload.question.upvotes} upvotes • {payload.question.answersCount} replies
          </p>
        </Card>
      )}
    </AppShell>
  );
}
