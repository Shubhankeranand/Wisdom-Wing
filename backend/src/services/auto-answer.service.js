function normalize(text) {
  return String(text ?? "").trim();
}

function tokenize(text) {
  return normalize(text)
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/i)
    .map((token) => token.trim())
    .filter(Boolean);
}

function hasAny(text, keywords) {
  const bag = new Set(tokenize(text));
  return keywords.some((keyword) => bag.has(keyword));
}

function buildQuestionText({ title, body, tags = [] }) {
  return [title, body, ...(tags ?? [])].filter(Boolean).join("\n");
}

function buildDeterministicFallbackAnswer({ title, body, tags = [] }) {
  const text = buildQuestionText({ title, body, tags });
  const lower = text.toLowerCase();

  if (hasAny(lower, ["job", "jobs", "placement", "placements", "career", "internship"])) {
    if (hasAny(lower, ["android", "kotlin", "mobile", "java"])) {
      return [
        "For Android development in Gurgaon, the most relevant roles are Android Developer, Mobile App Developer, Kotlin Developer, and sometimes SDE-1 roles with Android as the main skill.",
        "Focus on companies building consumer apps, fintech products, edtech apps, and service-based mobile teams. Start with internships and junior Android roles rather than searching only for \"best jobs.\"",
        "To improve your chances, build 2-3 solid projects, learn Kotlin, Jetpack components, APIs, Firebase, Git, and basic DSA, then apply on LinkedIn, Wellfound, Internshala, and company career pages.",
        "If you want, I can also help you with a Gurgaon-specific Android placement roadmap for 1st year, 2nd year, or final year."
      ].join(" ");
    }

    return [
      "For placement-oriented questions, start by identifying the exact role you want, such as developer, analyst, or internship roles, then build projects and skills around that target.",
      "For Gurgaon, product companies, startups, and service firms usually hire through LinkedIn, Internshala, Wellfound, Naukri, and direct company career pages.",
      "A practical next step is to strengthen one stack, keep DSA at interview level, and maintain a resume with projects, internships, and measurable work."
    ].join(" ");
  }

  if (hasAny(lower, ["android", "kotlin", "app", "mobile"])) {
    return [
      "For Android development, start with Kotlin, Android Studio, layouts, activities/fragments, Jetpack components, REST APIs, Firebase, and Git.",
      "Then build a few complete apps such as a notes app, chat app, expense tracker, or placement prep app so your learning becomes portfolio-ready.",
      "If your question is placement-focused, combine Android projects with resume work, LinkedIn outreach, and basic DSA practice."
    ].join(" ");
  }

  if (hasAny(lower, ["dsa", "leetcode", "cp", "coding"])) {
    return [
      "A good way to improve in DSA is to go topic by topic: arrays, strings, recursion, linked lists, stacks/queues, trees, graphs, and dynamic programming.",
      "Do not only watch videos. Solve a manageable number of problems consistently and revise patterns.",
      "If you want, I can break this into a weekly plan based on your current year and skill level."
    ].join(" ");
  }

  return [
    "A useful way to approach this is to first identify the exact outcome you want, then break it into skills, resources, and next actions.",
    "If this depends on local college rules or internal processes, please confirm with seniors, faculty, or the official college source as well.",
    "If you want, I can help turn this into a more specific step-by-step plan."
  ].join(" ");
}

export async function generateAIAnswer({
  title,
  body,
  tags = [],
  communityName,
  collegeName
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.AI_MODEL ?? "gemini-2.5-flash";

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. Using deterministic fallback answer.");
    return buildDeterministicFallbackAnswer({ title, body, tags });
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const prompt = [
    "You are the Wisdom Wing assistant for college students.",
    "Write a relevant, direct, and student-friendly answer.",
    "Do not repeat the user's question back to them.",
    "Do not give generic filler.",
    "If the user asks about jobs, placements, or careers, answer with roles, skills, where to apply, and practical next steps.",
    "If the question depends on college-specific policy and you are unsure, say that clearly instead of inventing facts.",
    "Keep the answer under 140 words.",
    `Community: ${communityName ?? "General"}`,
    `College: ${collegeName ?? "N/A"}`,
    `Tags: ${(tags ?? []).join(", ") || "None"}`,
    `Title: ${normalize(title)}`,
    `Body: ${normalize(body)}`
  ].join("\n");

  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.warn(`Gemini generation failed, using deterministic fallback: ${errorBody}`);
    return buildDeterministicFallbackAnswer({ title, body, tags });
  }

  const payload = await response.json();
  const text =
    payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n").trim() ?? "";

  if (!text) {
    console.warn("Gemini returned empty text. Using deterministic fallback answer.");
    return buildDeterministicFallbackAnswer({ title, body, tags });
  }

  return text;
}
