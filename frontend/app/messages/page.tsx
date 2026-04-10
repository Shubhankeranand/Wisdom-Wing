"use client";

import { Paperclip, SendHorizonal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DefaultRightRail } from "@/components/right-rail";
import { Card } from "@/components/ui/card";

export default function MessagesPage() {
  return (
    <AppShell
      title="Messages"
      subtitle="A focused, academic-first collaboration layer for mentors, peers, and project teams."
      rightRail={<DefaultRightRail />}
    >
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="space-y-4">
          <input className="w-full rounded-lg border border-border bg-bg px-4 py-3 outline-none focus:border-primary" placeholder="Search chats" />
          {["Neha Bansal", "Placement Sprint Group", "DSA Study Circle"].map((chat) => (
            <div key={chat} className="rounded-xl border border-border px-4 py-3">
              <p className="font-medium">{chat}</p>
              <p className="text-xs text-textMuted">Last message preview goes here</p>
            </div>
          ))}
        </Card>
        <Card className="flex min-h-[520px] flex-col">
          <div className="border-b border-border pb-4">
            <p className="font-semibold">Neha Bansal</p>
            <p className="text-xs text-textMuted">Frontend mentor • 3 mutual communities</p>
          </div>
          <div className="flex-1 space-y-4 py-5">
            <div className="max-w-md rounded-2xl rounded-bl-md bg-surfaceAlt px-4 py-3 text-sm text-textMuted">
              Could you review my internship landing page tonight?
            </div>
            <div className="ml-auto max-w-md rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm text-white">
              Yes, send the repo link and the areas where you want feedback first.
            </div>
          </div>
          <div className="flex items-center gap-3 border-t border-border pt-4">
            <button className="rounded-lg border border-border p-2 text-textMuted">
              <Paperclip className="h-4 w-4" />
            </button>
            <input className="flex-1 rounded-lg border border-border bg-bg px-4 py-3 outline-none focus:border-primary" placeholder="Write a message..." />
            <button className="rounded-lg bg-primary p-3 text-white">
              <SendHorizonal className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
