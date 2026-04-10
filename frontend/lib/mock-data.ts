import { FeedPost, NavItem, QuestionAnswer, SearchResult, SuggestedConnection } from "@/lib/types";

export const leftNav: NavItem[] = [
  { label: "Home", href: "/dashboard" },
  { label: "Communities", href: "/communities", badge: "12" },
  { label: "Resources", href: "/resources" },
  { label: "Events", href: "/events" },
  { label: "Messages", href: "/messages", badge: "4" },
  { label: "Admin", href: "/admin" }
];

export const feedPosts: FeedPost[] = [
  {
    id: "q1",
    author: "Aarav Mehta",
    role: "2nd Year CSE",
    college: "NIT Delhi",
    title: "Best first-year roadmap for DSA without getting overwhelmed?",
    snippet: "I want a path that balances college coursework, C++ basics, and practice without burnout. Any curated sequence helps.",
    tags: ["DSA", "First Year", "Roadmap"],
    verified: true,
    votes: 42,
    comments: 16,
    timestamp: "2h ago"
  },
  {
    id: "q2",
    author: "Riya Sharma",
    role: "Final Year ECE",
    college: "DTU",
    title: "Placement prep resources for aptitude + core electronics in 8 weeks",
    snippet: "Looking for a realistic study plan, especially for students juggling projects and attendance issues.",
    tags: ["Placements", "ECE", "Aptitude"],
    verified: true,
    votes: 31,
    comments: 11,
    timestamp: "4h ago"
  },
  {
    id: "q3",
    author: "Kabir Singh",
    role: "Alumni Mentor",
    college: "IIT Roorkee",
    title: "How our study circle turned PYQs into a scoring system",
    snippet: "Sharing the template we used to organize PYQs by topic, faculty pattern, and recurrence frequency.",
    tags: ["PYQ", "Study Group", "Resources"],
    votes: 58,
    comments: 23,
    timestamp: "Yesterday"
  }
];

export const suggestedConnections: SuggestedConnection[] = [
  { name: "Neha Bansal", field: "UI/UX + Frontend", mutuals: 8 },
  { name: "Vikram Joshi", field: "ML Research", mutuals: 5 },
  { name: "Sana Khan", field: "Placement Mentor", mutuals: 11 }
];

export const questionAnswers: QuestionAnswer[] = [
  {
    id: "a1",
    author: "Wisdom Wing AI",
    body: "Start with one language, one curated DSA sheet, and one revision block each week. Focus on arrays, strings, and recursion first, then slowly layer linked lists, stacks, and trees.",
    votes: 14,
    isAiGenerated: true
  },
  {
    id: "a2",
    author: "Pranav Gupta",
    body: "I made the most progress by pairing PYQs with a beginner sheet. The trick is to cap daily targets so you stay consistent across the semester.",
    votes: 28,
    best: true
  },
  {
    id: "a3",
    author: "Mitali Rao",
    body: "Join a small accountability group. Even a 30-minute nightly discussion helped us keep momentum without turning prep into a second full-time course load.",
    votes: 12
  }
];

export const searchResults: SearchResult[] = [
  {
    id: "s1",
    type: "question",
    title: "What are the best resources for learning DSA?",
    description: "Curated answers from seniors with language-wise roadmaps and practice sheets.",
    meta: "Question • 142 upvotes • CSE"
  },
  {
    id: "s2",
    type: "resource",
    title: "Operating Systems PYQ Vault",
    description: "Topic-tagged PDF bank with year filters and faculty notes.",
    meta: "Resource • PDF • 18 MB"
  },
  {
    id: "s3",
    type: "user",
    title: "Aditi Verma",
    description: "Final-year mentor focused on placements, mock interviews, and resume reviews.",
    meta: "User • Verified • 3 mutual communities"
  }
];
