"use client";

import { ArrowBigDown, ArrowBigUp, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DefaultRightRail } from "@/components/right-rail";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { questionAnswers } from "@/lib/mock-data";

export default function QuestionDetailPage() {
  return (
    <AppShell
      title="Question Detail"
      subtitle="AI guidance appears first for speed, while community answers retain authority."
      rightRail={<DefaultRightRail />}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <Card className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Tag>DSA</Tag>
              <Tag>First Year</Tag>
              <Tag>Roadmap</Tag>
            </div>
            <h2 className="text-2xl font-bold">Best first-year roadmap for DSA without getting overwhelmed?</h2>
            <p className="leading-7 text-textMuted">
              I want a balanced roadmap for learning core DSA while keeping up with classes and club work.
              I already know basic C++, but I freeze when every sheet looks huge and disconnected.
            </p>
          </Card>

          <Card className="border-primary/30 bg-aiBg">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-4 w-4" />
              AI Quick Summary
            </div>
            <p className="mt-3 text-sm leading-7 text-textMuted">
              AI-generated guidance is shown early to reduce waiting time. Community-verified answers may
              follow and should be prioritized when available.
            </p>
          </Card>

          <div className="space-y-4">
            {questionAnswers.map((answer) => (
              <Card
                key={answer.id}
                className={answer.best ? "border-success/60 ring-1 ring-success/40" : undefined}
              >
                <div className="flex gap-4">
                  <div className="flex flex-col items-center text-textMuted">
                    <ArrowBigUp className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold">{answer.votes}</span>
                    <ArrowBigDown className="h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{answer.author}</p>
                      {answer.best ? (
                        <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                          Best Answer
                        </span>
                      ) : null}
                      {answer.isAiGenerated ? (
                        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                          AI Generated
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm leading-7 text-textMuted">{answer.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">Related Questions</h3>
          <div className="space-y-3 text-sm text-textMuted">
            <p>How do I stay consistent with one DSA sheet during my first semester?</p>
            <p>Which CP and DSA balance works best for beginner coders?</p>
            <p>What are the most useful C++ resources before starting graphs?</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
