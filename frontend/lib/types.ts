export type Theme = "light" | "dark";

export type AppRoute =
  | "/"
  | "/dashboard"
  | "/communities"
  | "/resources"
  | "/events"
  | "/messages"
  | "/admin"
  | "/search"
  | "/profile"
  | "/ask"
  | "/auth/login"
  | "/auth/signup";

export type NavItem = {
  label: string;
  href: AppRoute;
  badge?: string;
};

export type FeedPost = {
  id: string;
  author: string;
  role: string;
  college: string;
  title: string;
  snippet: string;
  tags: string[];
  verified?: boolean;
  votes: number;
  comments: number;
  timestamp: string;
};

export type SuggestedConnection = {
  name: string;
  field: string;
  mutuals: number;
};

export type QuestionAnswer = {
  id: string;
  author: string;
  body: string;
  votes: number;
  best?: boolean;
  isAiGenerated?: boolean;
};

export type SearchResult = {
  id: string;
  type: "question" | "resource" | "user";
  title: string;
  description: string;
  meta: string;
};
