"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormInput, FormTextarea } from "@/components/ui/form-input";
import { Tabs } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import { CommunityDetailPayload, communityService } from "@/lib/services";

type CommunityTab = "home" | "posts" | "resources" | "events";

export default function CommunityDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<CommunityDetailPayload | null>(null);
  const [tab, setTab] = useState<CommunityTab>("home");
  const [message, setMessage] = useState("");
  const [verificationUrl, setVerificationUrl] = useState("");
  const [postForm, setPostForm] = useState({
    title: "",
    content: "",
    postType: "question" as "question" | "discussion" | "resource",
    resourceUrl: "",
    tags: "",
    isAnonymous: false
  });
  const [resourceForm, setResourceForm] = useState({ title: "", url: "", description: "" });
  const [eventForm, setEventForm] = useState({ title: "", description: "", startsAt: "", link: "" });

  const communityId = params.id;

  const loadCommunity = async () => {
    const payload = await communityService.get(communityId);
    setData(payload);
  };

  useEffect(() => {
    loadCommunity();
  }, [communityId]);

  const upcomingEvents = useMemo(
    () => data?.events.filter((event) => new Date(event.startsAt) >= new Date()) ?? [],
    [data]
  );
  const pastEvents = useMemo(
    () => data?.events.filter((event) => new Date(event.startsAt) < new Date()) ?? [],
    [data]
  );

  if (!data) {
    return (
      <AppShell title="Community" subtitle="Loading community...">
        <Card>Loading community...</Card>
      </AppShell>
    );
  }

  const { community } = data;

  const joinCommunity = async () => {
    setMessage("");
    try {
      const response = await communityService.join(communityId);
      setMessage(response.status === "pending" ? "Join request submitted for approval." : "Joined community.");
      await loadCommunity();
    } catch (caughtError) {
      setMessage(caughtError instanceof Error ? caughtError.message : "Unable to join community");
    }
  };

  const submitVerification = async () => {
    setMessage("");
    await communityService.submitVerification(communityId, verificationUrl);
    setVerificationUrl("");
    setMessage("Verification request submitted for admin approval.");
    await loadCommunity();
  };

  const createPost = async () => {
    await communityService.createPost(communityId, {
      title: postForm.title,
      content: postForm.content,
      postType: postForm.postType,
      resourceUrl: postForm.resourceUrl,
      tags: postForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      isAnonymous: postForm.isAnonymous
    });
    setPostForm({ title: "", content: "", postType: "question", resourceUrl: "", tags: "", isAnonymous: false });
    await loadCommunity();
  };

  const createResource = async () => {
    await communityService.createResource(communityId, resourceForm);
    setResourceForm({ title: "", url: "", description: "" });
    await loadCommunity();
  };

  const createEvent = async () => {
    await communityService.createEvent(communityId, eventForm);
    setEventForm({ title: "", description: "", startsAt: "", link: "" });
    await loadCommunity();
  };

  const joinEvent = async (eventId: string) => {
    await communityService.joinEvent(communityId, eventId);
    await loadCommunity();
  };

  return (
    <AppShell title={community.name} subtitle={community.description ?? "Community workspace"}>
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-textMuted">
              {community.type} community {community.college ? `• ${community.college}` : ""} •{" "}
              {community.memberCount ?? 0} members
            </p>
          </div>
          {community.isMember ? (
            <Tag>Member</Tag>
          ) : community.joinRequestPending ? (
            <Tag>Join Request Pending</Tag>
          ) : (
            <Button onClick={joinCommunity}>
              {community.type === "college" ? "Request Join" : "Join Community"}
            </Button>
          )}
        </div>

        {community.type === "college" && !community.isMember ? (
          <div className="grid gap-3 rounded-xl border border-border bg-bg p-4">
            <p className="text-sm text-textMuted">
              College communities require approved ID verification before joining.
            </p>
            <FormInput
              label="ID card proof link"
              value={verificationUrl}
              onChange={(event) => setVerificationUrl(event.target.value)}
              placeholder="Paste a secure Drive link or uploaded document URL"
            />
            <Button variant="secondary" onClick={submitVerification}>
              Submit Verification
            </Button>
          </div>
        ) : null}

        {message ? <p className="text-sm text-primary">{message}</p> : null}
      </Card>

      <Tabs
        tabs={[
          { label: "Home", value: "home" },
          { label: "Posts", value: "posts" },
          { label: "Resources", value: "resources" },
          { label: "Events", value: "events" }
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "home" ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <Card className="space-y-3">
            <h3 className="text-xl font-semibold">Top Posts</h3>
            {data.home.topPosts.length ? (
              data.home.topPosts.map((post) => (
                <div key={post._id} className="rounded-lg border border-border p-3">
                  <p className="font-medium">{post.title}</p>
                  <p className="mt-1 text-sm text-textMuted">{post.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-textMuted">No posts yet.</p>
            )}
          </Card>
          <Card className="space-y-3">
            <h3 className="text-xl font-semibold">Top Unanswered Questions</h3>
            {data.home.topUnansweredPosts.length ? (
              data.home.topUnansweredPosts.map((post) => (
                <Link key={post._id} href={`/posts/${post._id}`} className="block rounded-lg border border-border p-3 text-sm hover:bg-surfaceAlt">
                  {post.title}
                </Link>
              ))
            ) : (
              <p className="text-sm text-textMuted">No unanswered questions.</p>
            )}
          </Card>
        </div>
      ) : null}

      {tab === "posts" ? (
        <div className="space-y-5">
          {community.isMember ? (
            <Card className="space-y-4">
              <h3 className="text-xl font-semibold">Create a Post</h3>
              <select
                className="rounded-lg border border-border bg-bg px-4 py-3 text-sm"
                value={postForm.postType}
                onChange={(event) =>
                  setPostForm((current) => ({
                    ...current,
                    postType: event.target.value as "question" | "discussion" | "resource"
                  }))
                }
              >
                <option value="question">Question</option>
                <option value="discussion">Discussion</option>
                <option value="resource">Resource</option>
              </select>
              <FormInput label="Title" value={postForm.title} onChange={(event) => setPostForm((current) => ({ ...current, title: event.target.value }))} />
              <FormTextarea label="Content" value={postForm.content} onChange={(event) => setPostForm((current) => ({ ...current, content: event.target.value }))} />
              {postForm.postType === "resource" ? (
                <FormInput label="Resource Link" value={postForm.resourceUrl} onChange={(event) => setPostForm((current) => ({ ...current, resourceUrl: event.target.value }))} />
              ) : null}
              <FormInput label="Interest Tags" placeholder="DSA, Web Dev, Placements" value={postForm.tags} onChange={(event) => setPostForm((current) => ({ ...current, tags: event.target.value }))} />
              <label className="flex items-center gap-2 text-sm text-textMuted">
                <input type="checkbox" checked={postForm.isAnonymous} onChange={(event) => setPostForm((current) => ({ ...current, isAnonymous: event.target.checked }))} />
                Post anonymously
              </label>
              <Button onClick={createPost}>Create a Post</Button>
            </Card>
          ) : null}
          {data.posts.length ? (
            data.posts.map((post) => (
              <Card key={post._id} className="space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <Tag>{post.postType}</Tag>
                  </div>
                  <p className="text-xs text-textMuted">
                    {post.isAnonymous
                      ? "Anonymous"
                      : `@${post.authorId?.username ?? "user"} • ${post.authorId?.status ?? "Member"}`}
                  </p>
                </div>
                <p className="text-sm text-textMuted">{post.content}</p>
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
                <p className="text-xs text-textMuted">{post.score} score • {post.repliesCount} replies</p>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-sm text-textMuted">No posts created in this community yet.</p>
            </Card>
          )}
        </div>
      ) : null}

      {tab === "resources" ? (
        <div className="space-y-5">
          {community.isMember ? (
            <Card className="space-y-4">
              <h3 className="text-xl font-semibold">Share a Resource</h3>
              <FormInput label="Title" value={resourceForm.title} onChange={(event) => setResourceForm((current) => ({ ...current, title: event.target.value }))} />
              <FormInput label="Link" value={resourceForm.url} onChange={(event) => setResourceForm((current) => ({ ...current, url: event.target.value }))} />
              <FormTextarea label="Description" value={resourceForm.description} onChange={(event) => setResourceForm((current) => ({ ...current, description: event.target.value }))} />
              <Button onClick={createResource}>Share Resource</Button>
            </Card>
          ) : null}
          {data.resources.length ? (
            data.resources.map((resource) => (
              <Card key={resource._id} className="space-y-2">
                <a href={resource.url} target="_blank" className="font-semibold text-primary">
                  {resource.title}
                </a>
                {resource.description ? <p className="mt-2 text-sm text-textMuted">{resource.description}</p> : null}
                <a href={`/resources/${resource._id}`} className="text-sm font-medium text-textMuted hover:text-primary">
                  Discuss resource
                </a>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-sm text-textMuted">No resources shared yet.</p>
            </Card>
          )}
        </div>
      ) : null}

      {tab === "events" ? (
        <div className="space-y-5">
          {community.isAdmin ? (
            <Card className="space-y-4">
              <h3 className="text-xl font-semibold">Create Event</h3>
              <FormInput label="Title" value={eventForm.title} onChange={(event) => setEventForm((current) => ({ ...current, title: event.target.value }))} />
              <FormTextarea label="Description" value={eventForm.description} onChange={(event) => setEventForm((current) => ({ ...current, description: event.target.value }))} />
              <FormInput label="Date and Time" type="datetime-local" value={eventForm.startsAt} onChange={(event) => setEventForm((current) => ({ ...current, startsAt: event.target.value }))} />
              <FormInput label="Optional Link" value={eventForm.link} onChange={(event) => setEventForm((current) => ({ ...current, link: event.target.value }))} />
              <Button onClick={createEvent}>Create Event</Button>
            </Card>
          ) : null}
          <Card className="space-y-3">
            <h3 className="text-xl font-semibold">Upcoming Events</h3>
            {upcomingEvents.length ? upcomingEvents.map((event) => (
              <div key={event._id} className="rounded-lg border border-border p-3">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-textMuted">{new Date(event.startsAt).toLocaleString()}</p>
                {event.link ? (
                  <a href={event.link} target="_blank" className="mt-2 inline-block text-sm text-primary">
                    Open event link
                  </a>
                ) : null}
                {community.isMember ? (
                  <Button variant="secondary" className="mt-3" onClick={() => joinEvent(event._id)}>
                    Join Event
                  </Button>
                ) : null}
              </div>
            )) : <p className="text-sm text-textMuted">No upcoming events.</p>}
          </Card>
          <Card className="space-y-3">
            <h3 className="text-xl font-semibold">Past Events</h3>
            {pastEvents.length ? pastEvents.map((event) => (
              <div key={event._id} className="rounded-lg border border-border p-3">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-textMuted">{new Date(event.startsAt).toLocaleString()}</p>
              </div>
            )) : <p className="text-sm text-textMuted">No past events.</p>}
          </Card>
        </div>
      ) : null}
    </AppShell>
  );
}
