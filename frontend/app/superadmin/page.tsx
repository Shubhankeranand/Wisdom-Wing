"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { superadminService, SuperadminOverviewPayload } from "@/lib/services";

type SuperadminTab = "requests" | "communities" | "users" | "stats";

export default function SuperadminPage() {
  const [overview, setOverview] = useState<SuperadminOverviewPayload | null>(null);
  const [tab, setTab] = useState<SuperadminTab>("requests");

  const loadOverview = () => superadminService.overview().then(setOverview);

  useEffect(() => {
    loadOverview();
  }, []);

  const reviewRequest = async (requestId: string, action: "approve" | "reject") => {
    await superadminService.reviewCommunityRequest(requestId, action);
    await loadOverview();
  };

  const assignRoles = async (userId: string, roles: string[]) => {
    await superadminService.updateUserRoles(userId, roles);
    await loadOverview();
  };

  return (
    <AppShell title="Superadmin" subtitle="Full platform control for Wisdom Wing.">
      {!overview ? (
        <Card>Loading superadmin dashboard...</Card>
      ) : (
        <div className="space-y-5">
          <Tabs
            tabs={[
              { label: "Community Requests", value: "requests" },
              { label: "Communities", value: "communities" },
              { label: "Users", value: "users" },
              { label: "Stats", value: "stats" }
            ]}
            value={tab}
            onChange={setTab}
          />

          {tab === "requests" ? (
            <Card className="space-y-4">
              <h3 className="text-xl font-semibold">Community Requests</h3>
              {overview.requests.length ? (
                overview.requests.map((request) => (
                  <div key={request._id} className="rounded-lg border border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{request.communityName}</p>
                        <p className="text-sm text-textMuted">
                          {request.type} {request.collegeName ? `• ${request.collegeName}` : ""} • {request.status}
                        </p>
                        <p className="mt-2 text-sm text-textMuted">{request.description}</p>
                        {request.proofOfIdUrl ? (
                          <a href={request.proofOfIdUrl} target="_blank" className="mt-2 inline-block text-sm text-primary">
                            Open proof
                          </a>
                        ) : null}
                      </div>
                      {request.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button onClick={() => reviewRequest(request._id, "approve")}>Approve</Button>
                          <Button variant="secondary" onClick={() => reviewRequest(request._id, "reject")}>
                            Reject
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-textMuted">No community requests yet.</p>
              )}
            </Card>
          ) : null}

          {tab === "communities" ? (
            <Card className="space-y-4">
              <h3 className="text-xl font-semibold">Communities Management</h3>
              {overview.communities.map((community) => (
                <div key={community._id} className="rounded-lg border border-border p-4">
                  <p className="font-semibold">{community.name}</p>
                  <p className="text-sm text-textMuted">
                    {community.type} • {community.memberCount ?? 0} members
                  </p>
                </div>
              ))}
            </Card>
          ) : null}

          {tab === "users" ? (
            <Card className="space-y-4">
              <h3 className="text-xl font-semibold">User Management</h3>
              {overview.users.map((user) => (
                <div key={user._id} className="rounded-lg border border-border p-4">
                  <p className="font-semibold">{user.fullName || user.username || user.email}</p>
                  <p className="text-sm text-textMuted">{user.email} • {user.roles.join(", ")}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => assignRoles(user._id, ["user"])}>
                      User
                    </Button>
                    <Button variant="secondary" onClick={() => assignRoles(user._id, ["user", "admin"])}>
                      Admin
                    </Button>
                    <Button variant="secondary" onClick={() => assignRoles(user._id, ["superadmin"])}>
                      Superadmin
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          ) : null}

          {tab === "stats" ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <p className="text-sm text-textMuted">Total Users</p>
                <p className="mt-2 text-3xl font-bold">{overview.stats.totalUsers}</p>
              </Card>
              <Card>
                <p className="text-sm text-textMuted">Total Communities</p>
                <p className="mt-2 text-3xl font-bold">{overview.stats.totalCommunities}</p>
              </Card>
              <Card>
                <p className="text-sm text-textMuted">Total Posts</p>
                <p className="mt-2 text-3xl font-bold">{overview.stats.totalPosts}</p>
              </Card>
            </div>
          ) : null}
        </div>
      )}
    </AppShell>
  );
}
