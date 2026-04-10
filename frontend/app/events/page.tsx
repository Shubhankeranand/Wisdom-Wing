"use client";

import { AppShell } from "@/components/app-shell";
import { DefaultRightRail } from "@/components/right-rail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";

const events = [
  { date: "APR 02", title: "Resume Review Sprint", location: "Placement Cell", type: "Workshop" },
  { date: "APR 05", title: "Hackathon Team Match", location: "Online", type: "Hackathon" },
  { date: "APR 08", title: "OS Midsem Study Group", location: "Library Block", type: "Study Group" }
];

export default function EventsPage() {
  return (
    <AppShell
      title="Events"
      subtitle="A scan-friendly campus calendar for workshops, hackathons, and study circles."
      rightRail={<DefaultRightRail />}
    >
      <Card className="flex flex-wrap items-center gap-3">
        <Button>+ Create Event</Button>
        <Tag>Workshops</Tag>
        <Tag>Hackathons</Tag>
        <Tag>Study Groups</Tag>
        <Tag>Social</Tag>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <Card key={event.title} className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-primary px-3 py-3 text-center text-sm font-bold text-white">
                {event.date}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-textMuted">{event.location}</p>
                <p className="text-xs text-textMuted">{event.type}</p>
              </div>
            </div>
            <Button className="w-full">RSVP</Button>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
