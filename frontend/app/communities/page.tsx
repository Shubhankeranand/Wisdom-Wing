"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { Community } from "@/lib/types";
import { communityService } from "@/lib/services";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [requestForm, setRequestForm] = useState({
    type: "open" as "open" | "college",
    communityName: "",
    collegeName: "",
    description: "",
    adminName: "",
    adminEmail: "",
    adminDesignation: "",
    proofOfIdUrl: "",
    creatorName: "",
    creatorEmail: ""
  });
  const [isPending, startTransition] = useTransition();

  const loadCommunities = (nextQuery = query) => {
    startTransition(async () => {
      const data = await communityService.list(nextQuery);
      setCommunities(data.communities);
    });
  };

  const submitCommunityRequest = async () => {
    setMessage("");
    await communityService.requestCreate(requestForm);
    setMessage("Community creation request submitted for superadmin review.");
    setRequestForm({
      type: "open",
      communityName: "",
      collegeName: "",
      description: "",
      adminName: "",
      adminEmail: "",
      adminDesignation: "",
      proofOfIdUrl: "",
      creatorName: "",
      creatorEmail: ""
    });
  };

  useEffect(() => {
    loadCommunities("");
  }, []);

  const join = async (communityId: string) => {
    setMessage("");
    const response = await communityService.join(communityId);
    setMessage(response.status === "pending" ? "Join request submitted for approval." : "Joined community.");
    loadCommunities();
  };

  return (
    <AppShell title="Join Communities" subtitle="Discover focused college and open communities.">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <Card className="space-y-4">
          <FormInput
            label="Community Search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              loadCommunities(event.target.value);
            }}
            placeholder="Search by community name, college, or tag"
          />
          {message ? <p className="text-sm text-primary">{message}</p> : null}
        </Card>
        <h2 className="text-xl font-semibold">Top Communities</h2>
        {isPending ? <Card>Loading communities...</Card> : null}
        {communities.length ? (
          communities.slice(0, 10).map((community) => (
            <Card key={community._id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={`/community/${community._id}`} className="text-xl font-semibold hover:text-primary">
                    {community.name}
                  </Link>
                  <p className="text-sm text-textMuted">{community.description}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-primary">
                    {community.memberCount ?? 0} members • {community.type}
                    {community.college ? ` • ${community.college}` : ""}
                  </p>
                </div>
                {community.isMember ? (
                  <Link href={`/community/${community._id}`}>
                    <Button variant="secondary">Open</Button>
                  </Link>
                ) : community.joinRequestPending ? (
                  <Button variant="secondary" disabled>
                    Pending
                  </Button>
                ) : (
                  <Button onClick={() => join(community._id)}>
                    {community.type === "college" ? "Request Join" : "Join"}
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : !isPending ? (
          <Card>
            <p className="text-sm text-textMuted">No communities found.</p>
          </Card>
        ) : null}
      </div>

      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">Request a Community</h2>
        <select
          className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-sm"
          value={requestForm.type}
          onChange={(event) =>
            setRequestForm((current) => ({ ...current, type: event.target.value as "open" | "college" }))
          }
        >
          <option value="open">Open Community</option>
          <option value="college">College Community</option>
        </select>
        <FormInput label="Community Name" value={requestForm.communityName} onChange={(event) => setRequestForm((current) => ({ ...current, communityName: event.target.value }))} />
        <FormTextarea label="Description" value={requestForm.description} onChange={(event) => setRequestForm((current) => ({ ...current, description: event.target.value }))} />
        {requestForm.type === "college" ? (
          <>
            <FormInput label="College Name" value={requestForm.collegeName} onChange={(event) => setRequestForm((current) => ({ ...current, collegeName: event.target.value }))} />
            <FormInput label="Admin Name" value={requestForm.adminName} onChange={(event) => setRequestForm((current) => ({ ...current, adminName: event.target.value }))} />
            <FormInput label="Admin Email" value={requestForm.adminEmail} onChange={(event) => setRequestForm((current) => ({ ...current, adminEmail: event.target.value }))} />
            <FormInput label="Admin Designation" value={requestForm.adminDesignation} onChange={(event) => setRequestForm((current) => ({ ...current, adminDesignation: event.target.value }))} />
            <FormInput label="Proof of ID Link" value={requestForm.proofOfIdUrl} onChange={(event) => setRequestForm((current) => ({ ...current, proofOfIdUrl: event.target.value }))} />
          </>
        ) : (
          <>
            <FormInput label="Creator Name" value={requestForm.creatorName} onChange={(event) => setRequestForm((current) => ({ ...current, creatorName: event.target.value }))} />
            <FormInput label="Creator Email" value={requestForm.creatorEmail} onChange={(event) => setRequestForm((current) => ({ ...current, creatorEmail: event.target.value }))} />
          </>
        )}
        <Button className="w-full" onClick={submitCommunityRequest}>
          Submit Request
        </Button>
      </Card>
      </div>
    </AppShell>
  );
}
