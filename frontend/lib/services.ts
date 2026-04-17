import { apiFetch } from "@/lib/api";
import {
  AppUser,
  Community,
  CommunityEvent,
  CommunityPost,
  CommunityQuestion,
  CommunityResource
} from "@/lib/types";

export type OnboardingPayload = {
  fullName: string;
  username: string;
  college: string;
  status: string;
  interests: string[];
};

export type DashboardPayload = {
  user: AppUser;
  posts: Array<{ _id: string; title: string; postType: string; communityId?: string }>;
  questions: Array<{ _id: string; title: string }>;
  saved: {
    posts: Array<{ _id: string; title: string; postType: string; communityId?: string }>;
    questions: Array<{ _id: string; title: string }>;
    resources: Array<{ _id: string; title: string; url?: string }>;
  };
  communities: Community[];
  events: Array<{
    _id: string;
    title: string;
    startsAt: string;
    communityId?: { _id: string; name: string };
  }>;
};

export type CommunityDetailPayload = {
  community: Community;
  home: {
    topPosts: CommunityPost[];
    topUnansweredPosts: CommunityPost[];
  };
  posts: CommunityPost[];
  resources: CommunityResource[];
  events: CommunityEvent[];
};

export type CommunityRequestPayload = {
  type: "college" | "open";
  communityName: string;
  collegeName?: string;
  description: string;
  adminName?: string;
  adminEmail?: string;
  adminDesignation?: string;
  proofOfIdUrl?: string;
  creatorName?: string;
  creatorEmail?: string;
};

export type GlobalSearchResult = {
  id: string;
  type: "post" | "community" | "user";
  title: string;
  subtitle?: string;
  href: string;
};

export const userService = {
  getMe: () => apiFetch<{ user: AppUser }>("/api/users/me"),
  checkUsername: (username: string) =>
    apiFetch<{ available: boolean; message?: string }>(
      `/api/users/username-available?username=${encodeURIComponent(username)}`
    ),
  completeOnboarding: (payload: OnboardingPayload) =>
    apiFetch<{ user: AppUser }>("/api/users/onboarding", {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  updateProfile: (payload: Partial<OnboardingPayload>) =>
    apiFetch<{ user: AppUser }>("/api/users/profile", {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  getDashboard: () => apiFetch<DashboardPayload>("/api/users/dashboard")
};

export const communityService = {
  list: (query = "") =>
    apiFetch<{ communities: Community[] }>(
      `/api/communities${query ? `?query=${encodeURIComponent(query)}` : ""}`
    ),
  create: (payload: Pick<Community, "name" | "description" | "type" | "college">) =>
    apiFetch<{ community: Community }>("/api/communities", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  requestCreate: (payload: CommunityRequestPayload) =>
    apiFetch<{ request: { _id: string; status: string } }>("/api/communities/requests", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  get: (id: string) => apiFetch<CommunityDetailPayload>(`/api/communities/${id}`),
  join: (id: string) =>
    apiFetch<{ community: Community; status: "joined" | "pending" }>(`/api/communities/${id}/join`, {
      method: "POST"
    }),
  submitVerification: (id: string, documentUrl: string) =>
    apiFetch<{ message: string }>(`/api/communities/${id}/verification-request`, {
      method: "POST",
      body: JSON.stringify({ documentUrl })
    }),
  createPost: (
    id: string,
    payload: {
      title: string;
      content: string;
      postType: "question" | "discussion" | "resource";
      tags: string[];
      isAnonymous: boolean;
      resourceUrl?: string;
    }
  ) =>
    apiFetch<{ post: CommunityPost }>(`/api/communities/${id}/posts`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  createResource: (id: string, payload: { title: string; url: string; description?: string }) =>
    apiFetch<{ resource: CommunityResource }>(`/api/communities/${id}/resources`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  createEvent: (
    id: string,
    payload: { title: string; description: string; startsAt: string; link?: string }
  ) =>
    apiFetch<{ event: CommunityEvent }>(`/api/communities/${id}/events`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  joinEvent: (communityId: string, eventId: string) =>
    apiFetch<{ event: CommunityEvent }>(`/api/communities/${communityId}/events/${eventId}/join`, {
      method: "POST"
    })
};

export const searchService = {
  global: (query: string) =>
    apiFetch<{ results: GlobalSearchResult[] }>(
      `/api/search/global?query=${encodeURIComponent(query)}`
    )
};

export type HomeFeedPayload = {
  posts: CommunityPost[];
  topUnansweredPosts: CommunityPost[];
};

export const feedService = {
  home: () => apiFetch<HomeFeedPayload>("/api/feed/home")
};

export type Reply = {
  _id: string;
  content: string;
  createdAt: string;
  authorId?: {
    username?: string;
    fullName?: string;
    status?: string;
  };
};

export const postService = {
  get: (id: string) =>
    apiFetch<{ post: CommunityPost; replies: Reply[]; userVote: number }>(`/api/posts/${id}`),
  vote: (id: string, value: -1 | 0 | 1) =>
    apiFetch<{ score: number; userVote: number }>(`/api/posts/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ value })
    }),
  reply: (id: string, content: string) =>
    apiFetch<{ reply: Reply }>(`/api/posts/${id}/replies`, {
      method: "POST",
      body: JSON.stringify({ content })
    })
};

export const resourceService = {
  get: (id: string) =>
    apiFetch<{ resource: CommunityResource & { score: number; repliesCount: number }; replies: Reply[]; userVote: number }>(
      `/api/resources/${id}`
    ),
  vote: (id: string, value: -1 | 0 | 1) =>
    apiFetch<{ score: number; userVote: number }>(`/api/resources/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ value })
    }),
  reply: (id: string, content: string) =>
    apiFetch<{ reply: Reply }>(`/api/resources/${id}/replies`, {
      method: "POST",
      body: JSON.stringify({ content })
    })
};

export type AdminOverviewPayload = {
  communities: Community[];
  posts: CommunityPost[];
  events: CommunityEvent[];
};

export const adminService = {
  overview: () => apiFetch<AdminOverviewPayload>("/api/admin/overview"),
  reviewJoinRequest: (communityId: string, userId: string, action: "approve" | "reject") =>
    apiFetch<{ message: string }>(`/api/admin/communities/${communityId}/join-requests/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ action })
    }),
  deletePost: (postId: string) =>
    apiFetch<{ message: string }>(`/api/admin/posts/${postId}`, {
      method: "DELETE"
    }),
  createEvent: (
    communityId: string,
    payload: { title: string; description: string; startsAt: string; link?: string }
  ) =>
    apiFetch<{ event: CommunityEvent }>(`/api/admin/communities/${communityId}/events`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  deleteEvent: (eventId: string) =>
    apiFetch<{ message: string }>(`/api/admin/events/${eventId}`, {
      method: "DELETE"
    })
};

export type SuperadminOverviewPayload = {
  requests: Array<{
    _id: string;
    type: "college" | "open";
    communityName: string;
    collegeName?: string;
    description: string;
    adminName?: string;
    adminEmail?: string;
    adminDesignation?: string;
    proofOfIdUrl?: string;
    creatorName?: string;
    creatorEmail?: string;
    status: "pending" | "approved" | "rejected";
  }>;
  communities: Community[];
  users: Array<{
    _id: string;
    fullName?: string;
    username?: string;
    email: string;
    roles: string[];
    status?: string;
  }>;
  stats: {
    totalUsers: number;
    totalCommunities: number;
    totalPosts: number;
  };
};

export const superadminService = {
  overview: () => apiFetch<SuperadminOverviewPayload>("/api/superadmin/overview"),
  reviewCommunityRequest: (requestId: string, action: "approve" | "reject") =>
    apiFetch<{ request: { _id: string; status: string } }>(`/api/superadmin/community-requests/${requestId}`, {
      method: "PATCH",
      body: JSON.stringify({ action })
    }),
  updateUserRoles: (userId: string, roles: string[]) =>
    apiFetch<{ user: { _id: string; roles: string[] } }>(`/api/superadmin/users/${userId}/roles`, {
      method: "PATCH",
      body: JSON.stringify({ roles })
    })
};
