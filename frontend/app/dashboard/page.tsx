"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Tag } from "@/components/ui/tag";
import { interests } from "@/lib/options";
import { DashboardPayload, userService } from "@/lib/services";

export default function DashboardPage() {
  const { changePassword, refreshAppUser } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    fullName: "",
    username: "",
    college: "",
    status: "Student",
    interests: [] as string[]
  });

  useEffect(() => {
    userService.getDashboard().then((data) => {
      setDashboard(data);
      setProfile({
        fullName: data.user.fullName ?? "",
        username: data.user.username ?? "",
        college: data.user.college ?? "",
        status: data.user.status ?? "Student",
        interests: data.user.interests ?? []
      });
    });
  }, []);

  const saveProfile = async () => {
    const response = await userService.updateProfile(profile);
    await refreshAppUser();
    setDashboard((current) => (current ? { ...current, user: response.user } : current));
    setEditing(false);
  };

  const toggleInterest = (interest: string) => {
    setProfile((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest]
    }));
  };

  return (
    <AppShell title="Dashboard" subtitle="Manage your profile, account, content, and communities.">
      {!dashboard ? (
        <Card>Loading dashboard...</Card>
      ) : (
        <div className="space-y-5">
          <Card className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{dashboard.user.fullName}</h2>
                <p className="text-sm text-textMuted">
                  @{dashboard.user.username} • {dashboard.user.status}
                </p>
                <p className="mt-1 text-sm text-textMuted">{dashboard.user.college}</p>
              </div>
              <Button variant="secondary" onClick={() => setEditing((current) => !current)}>
                {editing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {editing ? (
              <div className="grid gap-4">
                <FormInput
                  label="Full Name"
                  value={profile.fullName}
                  onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))}
                />
                <FormInput
                  label="Username"
                  value={profile.username}
                  onChange={(event) => setProfile((current) => ({ ...current, username: event.target.value }))}
                />
                <FormInput
                  label="College"
                  value={profile.college}
                  onChange={(event) => setProfile((current) => ({ ...current, college: event.target.value }))}
                />
                <FormInput
                  label="Status"
                  value={profile.status}
                  onChange={(event) => setProfile((current) => ({ ...current, status: event.target.value }))}
                  placeholder="Student, Alumni, Research Intern..."
                />
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={
                        profile.interests.includes(interest)
                          ? "rounded-full bg-primary px-3 py-1 text-xs text-white"
                          : "rounded-full border border-border px-3 py-1 text-xs text-textMuted"
                      }
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <Button onClick={saveProfile}>Save Changes</Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {dashboard.user.interests.map((interest) => (
                  <Tag key={interest}>{interest}</Tag>
                ))}
              </div>
            )}
          </Card>

          <Card id="account-settings" className="space-y-4">
            <h3 className="text-xl font-semibold">Account Settings</h3>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <FormInput
                label="New Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter a new password"
              />
              <Button
                className="self-end"
                onClick={async () => {
                  await changePassword(password);
                  setPassword("");
                  setMessage("Password updated.");
                }}
              >
                Change Password
              </Button>
            </div>
            {message ? <p className="text-sm text-success">{message}</p> : null}
          </Card>

          <section className="grid gap-5 xl:grid-cols-2">
            <Card className="space-y-3">
              <h3 className="text-xl font-semibold">My Posts</h3>
              {dashboard.posts.length ? (
                dashboard.posts.map((post) => (
                  <Link key={post._id} href={`/posts/${post._id}`} className="block rounded-lg border border-border p-3 text-sm hover:bg-surfaceAlt">
                    <span className="font-medium">{post.title}</span>
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {post.postType}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-textMuted">You have not created posts yet.</p>
              )}
            </Card>

            <Card className="space-y-3">
              <h3 className="text-xl font-semibold">Bookmarks / Saved</h3>
              {dashboard.saved.posts.length || dashboard.saved.questions.length || dashboard.saved.resources.length ? (
                <>
                  {dashboard.saved.posts.map((post) => (
                    <Link key={post._id} href={`/posts/${post._id}`} className="block rounded-lg border border-border p-3 text-sm hover:bg-surfaceAlt">
                      {post.title}
                    </Link>
                  ))}
                  {dashboard.saved.questions.map((question) => (
                    <Link key={question._id} href={`/questions/${question._id}`} className="block rounded-lg border border-border p-3 text-sm hover:bg-surfaceAlt">
                      {question.title}
                    </Link>
                  ))}
                  {dashboard.saved.resources.map((resource) => (
                    <a key={resource._id} href={resource.url} className="block rounded-lg border border-border p-3 text-sm hover:bg-surfaceAlt">
                      {resource.title}
                    </a>
                  ))}
                </>
              ) : (
                <p className="text-sm text-textMuted">Saved questions and resources will appear here.</p>
              )}
            </Card>
          </section>

          <Card className="space-y-3">
            <h3 className="text-xl font-semibold">My Communities</h3>
            {dashboard.communities.length ? (
              dashboard.communities.map((community) => (
                <Link key={community._id} href={`/community/${community._id}`} className="block rounded-lg border border-border p-3 text-sm hover:bg-surfaceAlt">
                  {community.name}
                </Link>
              ))
            ) : (
              <p className="text-sm text-textMuted">Join an open community or request college verification to get started.</p>
            )}
          </Card>

          <Card className="space-y-3">
            <h3 className="text-xl font-semibold">My Events</h3>
            {dashboard.events.length ? (
              dashboard.events.map((event) => (
                <div key={event._id} className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-textMuted">
                    {event.communityId?.name ?? "Community"} • {new Date(event.startsAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-textMuted">Joined events will appear here.</p>
            )}
          </Card>
        </div>
      )}
    </AppShell>
  );
}
