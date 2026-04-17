"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EventsPage() {
  return (
    <AppShell title="Events" subtitle="Events are managed inside communities.">
      <Card className="space-y-4">
        <p className="text-sm text-textMuted">
          Open a community and use the Events tab to create or view upcoming sessions.
        </p>
        <Link href="/communities">
          <Button>Browse Communities</Button>
        </Link>
      </Card>
    </AppShell>
  );
}
