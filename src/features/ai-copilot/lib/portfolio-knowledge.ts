import {
  certifications,
  educationEntries,
  experienceEntries,
  featuredProjects,
  heroMetrics,
  profile,
  publicationEntries,
  skills,
  stackTechnologies,
  timeline,
} from "@/features/portfolio/data";

/**
 * Grounded, dependency-light knowledge layer for the portfolio assistant.
 *
 * - `buildPortfolioContext()` produces a compact factual brief for LLM grounding.
 * - `answerLocally()` is a fully offline retrieval assistant used when no API
 *   keys are configured. It detects intent + retrieves the right records so the
 *   answer is always grounded in real portfolio data (never hallucinated).
 */

const STOPWORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "is",
  "are", "was", "were", "be", "been", "his", "her", "their", "he", "she", "they",
  "you", "your", "me", "my", "i", "we", "it", "this", "that", "these", "those",
  "what", "which", "who", "whom", "whose", "how", "when", "where", "why", "do",
  "does", "did", "can", "could", "would", "should", "tell", "about", "give",
  "show", "list", "some", "any", "all", "more", "most", "please", "prajwal",
  "prajwals", "br", "him", "name", "names", "have", "has", "had", "into", "from",
  "at", "by", "as", "so", "if", "then", "than", "but", "also", "explain",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9.+#\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^-+|-+$/g, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function scoreText(queryTokens: string[], text: string): number {
  const haystack = text.toLowerCase();
  let score = 0;
  for (const token of queryTokens) {
    if (!token) continue;
    if (haystack.includes(token)) {
      // Whole-word matches weigh more than partial substring hits.
      const wordHit = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(haystack);
      score += wordHit ? 3 : 1;
    }
  }
  return score;
}

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));

// ---------------------------------------------------------------------------
// Section renderers (single source of truth for answer formatting)
// ---------------------------------------------------------------------------

function renderProject(p: (typeof featuredProjects)[number], detailed = false): string {
  const base = `**${p.title}** — ${p.category} · _${p.metric}_\n${p.summary}\n**Tech:** ${p.tags.join(", ")}\n[View repository](${p.projectUrl})`;
  return detailed ? base : base;
}

function answerAbout(): string {
  const edu = educationEntries[0];
  return `## About Prajwal B R

**${profile.tagline}** based in ${profile.location} (${profile.pronouns}).

${profile.about.join(" ")}

- **Education:** ${edu.degree}, ${edu.school} (${edu.period})
- **Current role:** ${experienceEntries[0].role} at ${experienceEntries[0].company}
- **Focus areas:** Full-stack development, AI & LLM integration, Blockchain & Web3, UI/UX engineering
- **Track record:** ${heroMetrics.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(", ")}

Want details on his **projects**, **experience**, **publications**, or **stack**? Just ask.`;
}

function answerProjects(opts?: { strongest?: boolean }): string {
  const list = opts?.strongest
    ? featuredProjects.filter((p) =>
        ["MediTrustChain", "KNOWLEDGE-BASE", "DeFi-Homes", "eden-thought", "AI-GRAMMAR"].includes(p.title),
      )
    : featuredProjects;

  const heading = opts?.strongest ? "## Strongest projects" : `## Projects (${featuredProjects.length})`;
  const body = list.map((p) => `### ${p.title}\n${renderProject(p)}`).join("\n\n");
  return `${heading}\n\n${body}\n\n_Ask about any project by name for a deeper explanation._`;
}

function answerProjectDetail(p: (typeof featuredProjects)[number]): string {
  return `## ${p.title}

**Category:** ${p.category}  ·  **Status:** ${p.metric}

${p.summary}

**Tech stack:** ${p.tags.join(", ")}

**Repository:** [${p.projectUrl.replace("https://", "")}](${p.projectUrl})`;
}

function answerExperience(): string {
  const body = experienceEntries
    .map((e) => {
      const head = `### ${e.role} — ${e.company}${e.contextBadge ? ` (${e.contextBadge})` : ""}`;
      const meta = `${e.period}${e.workMode ? ` · ${e.workMode}` : ""} · ${e.type}`;
      const highlights = e.highlights.length ? `\n${e.highlights.map((h) => `- ${h}`).join("\n")}` : "";
      return `${head}\n_${meta}_\n\n${e.description}${highlights}\n**Tech:** ${e.tags.join(", ")}`;
    })
    .join("\n\n");
  return `## Work experience\n\n${body}`;
}

function answerEducation(): string {
  const e = educationEntries[0];
  return `## Education

### ${e.degree}
**${e.school}** · ${e.period}

${e.description}

${e.highlights.map((h) => `- ${h}`).join("\n")}

**Focus areas:** ${e.tags.slice(0, 10).join(", ")}`;
}

function answerPublications(): string {
  const body = publicationEntries
    .map(
      (p) =>
        `### ${p.title}\n**${p.venuePill}** · _${p.status}_\n${p.venueLine}\n\n${p.summary}\n**Topics:** ${p.tags.join(", ")}\n[Publisher listing](${p.publisherUrl})`,
    )
    .join("\n\n");
  return `## Academic publications (${publicationEntries.length})\n\n${body}`;
}

function answerCertifications(): string {
  const body = certifications
    .map((c) => `- **${c.title}** — ${c.issuer} (${c.issuedDisplay})`)
    .join("\n");
  return `## Certifications (${certifications.length})\n\n${body}\n\nThese span generative AI, prompt engineering, full-stack development, cloud (Google/AWS), and AI fundamentals (IBM, Infosys).`;
}

function answerSkills(): string {
  const stackNames = stackTechnologies.map((s) => s.name).join(", ");
  return `## Skills & stack

**Core skills:** ${skills.join(", ")}

**Full technology stack:** ${stackNames}

He works across the full stack — frontend (Next.js, React, Tailwind), backend (Python, Django, Flask, Node.js), data (PostgreSQL, Supabase, MongoDB), blockchain (Solidity), and AI (OpenAI, Gemini, Groq, Hugging Face).`;
}

function answerContact(): string {
  return `## Get in touch

- **Email:** [${profile.email}](mailto:${profile.email})
- **GitHub:** [${profile.website.replace("https://", "")}](${profile.website})
- **LinkedIn:** [linkedin.com/in/prajwal-reddy-34024b307](https://linkedin.com/in/prajwal-reddy-34024b307)
- **Available for:** Full-time roles, internships, and freelance projects

You can also download his CV from the **CV** button in the header.`;
}

function answerAiUsage(): string {
  const aiProjects = featuredProjects.filter((p) =>
    /openai|groq|ai |gpt|anomaly|knowledge/i.test(`${p.title} ${p.summary} ${p.tags.join(" ")}`),
  );
  return `## How Prajwal uses AI

He builds **AI-native products**, not just demos:

- **This portfolio assistant** runs a dual engine — a server route streams OpenAI/Gemini responses token-by-token, and falls back to a fully offline browser assistant (what's answering you now) grounded in the site's real data.
- **In projects:**
${aiProjects.map((p) => `  - **${p.title}**: ${p.summary}`).join("\n")}

His 2024–2026 timeline moved from AI integration → LLM-backed features → AI-native product development with multi-model orchestration and edge streaming.`;
}

function answerOverview(): string {
  return `I'm Prajwal's portfolio assistant. I can answer questions about:

- **About** — who he is and what he focuses on
- **Projects** — ${featuredProjects.length}+ builds (try "tell me about MediTrustChain")
- **Experience** — including his current Nokia R&D internship
- **Education** — B.E. Computer Science at Dayananda Sagar University
- **Publications** — ${publicationEntries.length} academic papers (Springer / IEEE)
- **Certifications** — ${certifications.length} credentials
- **Skills & stack** — full-stack + AI + blockchain
- **Contact** — how to reach or hire him

What would you like to explore?`;
}

// ---------------------------------------------------------------------------
// Intent routing + retrieval
// ---------------------------------------------------------------------------

/**
 * Titles that are also common words in questions about the *site itself*
 * (e.g. "your portfolio"). We never auto-resolve these to a project to avoid
 * collisions; they still surface via keyword retrieval if truly relevant.
 */
const GENERIC_PROJECT_TITLES = new Set(["portfolio", "myportfolio"]);

/** Find a specific project the user named (exact-ish title / strong token overlap). */
function findNamedProject(query: string, tokens: string[]): (typeof featuredProjects)[number] | null {
  const q = query.toLowerCase();
  // Direct title containment (normalize separators)
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const qNorm = norm(q);
  for (const p of featuredProjects) {
    if (GENERIC_PROJECT_TITLES.has(norm(p.title))) continue;
    if (qNorm.includes(norm(p.title)) && norm(p.title).length >= 5) return p;
  }
  // Strong token overlap with exactly one project
  const ranked = featuredProjects
    .filter((p) => !GENERIC_PROJECT_TITLES.has(norm(p.title)))
    .map((p) => ({ p, score: scoreText(tokens, `${p.title} ${p.tags.join(" ")}`) }))
    .filter((r) => r.score >= 3)
    .sort((a, b) => b.score - a.score);
  if (ranked.length && (ranked.length === 1 || ranked[0].score > (ranked[1]?.score ?? 0))) {
    return ranked[0].p;
  }
  return null;
}

/** Keyword retrieval across every entity — used for the smart default. */
function retrieve(tokens: string[]): string | null {
  const projectHits = featuredProjects
    .map((p) => ({ p, score: scoreText(tokens, `${p.title} ${p.category} ${p.summary} ${p.tags.join(" ")}`) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const skillHits = skills.filter((s) => scoreText(tokens, s) > 0).slice(0, 12);
  const stackHits = stackTechnologies
    .filter((s) => scoreText(tokens, s.name) > 0)
    .map((s) => s.name)
    .slice(0, 12);

  const expHits = experienceEntries
    .map((e) => ({ e, score: scoreText(tokens, `${e.company} ${e.role} ${e.description} ${e.tags.join(" ")}`) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  const pubHits = publicationEntries
    .map((p) => ({ p, score: scoreText(tokens, `${p.title} ${p.summary} ${p.tags.join(" ")}`) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (!projectHits.length && !skillHits.length && !stackHits.length && !expHits.length && !pubHits.length) {
    return null;
  }

  let out = "Here's what I found in Prajwal's portfolio:\n\n";
  if (projectHits.length) {
    out += `### Related projects\n${projectHits.map((r) => `- **${r.p.title}** (${r.p.category}): ${r.p.summary}`).join("\n")}\n\n`;
  }
  if (expHits.length) {
    out += `### Experience\n${expHits.map((r) => `- **${r.e.role} @ ${r.e.company}** (${r.e.period})`).join("\n")}\n\n`;
  }
  if (pubHits.length) {
    out += `### Publications\n${pubHits.map((r) => `- **${r.p.title}** (${r.p.venuePill})`).join("\n")}\n\n`;
  }
  if (skillHits.length || stackHits.length) {
    const merged = Array.from(new Set([...skillHits, ...stackHits]));
    out += `### Relevant skills\n${merged.join(", ")}\n\n`;
  }
  out += "_Ask a follow-up for a deeper dive on any of these._";
  return out;
}

/**
 * Offline, grounded answer for the portfolio assistant.
 * Always returns real data — never invents employers, dates, or metrics.
 */
export function answerLocally(query: string): string {
  const q = query.toLowerCase().trim();
  const tokens = tokenize(query);

  if (!q) return answerOverview();

  // --- Casual / conversational layer (acts like a personal chatbot) ---
  if (/^(hi|hey|hello|yo|sup|hola|namaste|greetings|good (morning|afternoon|evening))\b/.test(q) ||
      q === "hi" || q === "hello") {
    return `Hey! 👋 I'm Prajwal's personal AI assistant. I can chat about pretty much anything, and I know Prajwal's work inside out — projects, experience, skills, education, and more.\n\nWhat's on your mind?`;
  }
  if (has(q, "thank", "thanks", "thx", "appreciate")) {
    return "You're welcome! Happy to help — ask me anything else. 😊";
  }
  if (/\b(how are you|how's it going|how are u|hows it going|what's up|whats up|how do you do)\b/.test(q)) {
    return "I'm doing great, thanks for asking! 🙌 I'm here and ready to help — whether it's a question, some coding help, or anything about Prajwal. What can I do for you?";
  }
  if (/\b(who are you|what are you|your name|who r u|what's your name|introduce yourself)\b/.test(q)) {
    return "I'm **Prajwal's personal AI assistant** — a friendly chatbot built into his portfolio. I can answer general questions and help with all sorts of things, and I'm also an expert on Prajwal's projects, experience, and skills. Ask me anything!";
  }
  if (/\b(what can you do|what do you do|help me|how can you help|capabilities|what can i ask)\b/.test(q)) {
    return `I'm a general-purpose assistant — here's how I can help:\n\n- **Chat & general questions** — ask me about almost anything\n- **Coding help** — explanations, debugging, snippets\n- **About Prajwal** — his projects, experience, education, publications, skills, and how to reach him\n\nGo ahead and ask me something!`;
  }

  // AI usage (checked before named-project so "...in his portfolio" doesn't
  // collide with the project literally titled "Portfolio")
  if (has(q, "ai", "llm", "artificial intelligence", "gpt", "openai", "gemini", "groq", "machine learning") &&
      has(q, "use", "uses", "using", "how", "integrate", "leverage", "apply")) {
    return answerAiUsage();
  }

  // Strongest / best / top projects
  if (has(q, "project", "build", "portfolio work", "open source", "open-source", "github") &&
      has(q, "strong", "best", "top", "favorite", "favourite", "impressive", "notable")) {
    return answerProjects({ strongest: true });
  }

  // Specific named project takes priority over generic "projects"
  const named = findNamedProject(query, tokens);
  if (named && (has(q, "project", "build", "repo", "explain", "tell", "what", "detail") || tokens.length <= 4)) {
    return answerProjectDetail(named);
  }

  // Contact / hire
  if (has(q, "contact", "email", "reach", "hire", "hiring", "available", "linkedin", "connect", "get in touch", "recruit")) {
    return answerContact();
  }

  // Resume / CV
  if (has(q, "resume", "cv", "curriculum")) {
    return `## Resume / CV\n\nYou can view and download Prajwal's CV from the **CV** button in the site header (both a fancy and an ATS-friendly version are available).\n\n${answerAbout()}`;
  }

  // Experience
  if (has(q, "experience", "work", "job", "intern", "internship", "nokia", "ohub", "career", "employ", "professional")) {
    return answerExperience();
  }

  // Education
  if (has(q, "education", "college", "university", "degree", "study", "studies", "cgpa", "gpa", "school", "academic background", "dayananda", "bengaluru", "graduat")) {
    return answerEducation();
  }

  // Publications
  if (has(q, "publication", "paper", "research", "ieee", "springer", "journal", "conference", "published")) {
    return answerPublications();
  }

  // Certifications
  if (has(q, "certification", "certificate", "certified", "course", "udemy", "credential", "badge", "bootcamp")) {
    return answerCertifications();
  }

  // Skills / stack
  if (has(q, "skill", "stack", "tech", "technolog", "language", "tool", "framework", "proficien", "expertise", "know")) {
    return answerSkills();
  }

  // Generic projects
  if (has(q, "project", "build", "made", "created", "portfolio work", "what has he", "what did he")) {
    return answerProjects();
  }

  // About / who
  if (has(q, "about", "who", "yourself", "background", "introduce", "tell me", "summary",
        "summarize", "overview", "bio", "what does", "what do you do", "does he do",
        "what is he", "what's he", "describe")) {
    return answerAbout();
  }

  // Smart retrieval fallback across all data
  const retrieved = retrieve(tokens);
  if (retrieved) return retrieved;

  // Vague/empty queries → friendly overview
  if (tokens.length === 0) return answerOverview();

  // General-knowledge question we can't fully answer offline. Be honest +
  // helpful instead of refusing. (A connected API key enables full answers.)
  return `That looks like a general question, and right now I'm running in **offline mode** — so I can't pull live general knowledge for it.

I can still fully help with anything about **Prajwal** — his projects, experience, skills, education, publications, or how to get in touch.

> Tip: connect a free AI API key (e.g. Google Gemini) in \`.env.local\` to unlock full general-purpose answers.`;
}

/**
 * Compact factual brief used to ground the live LLM (system prompt context).
 * Keeps the model from hallucinating employers, dates, or metrics.
 */
export function buildPortfolioContext(): string {
  const projects = featuredProjects
    .map((p) => `- ${p.title} (${p.category}, ${p.metric}): ${p.summary} [tech: ${p.tags.join(", ")}] ${p.projectUrl}`)
    .join("\n");

  const experience = experienceEntries
    .map((e) => `- ${e.role} at ${e.company} (${e.period}${e.workMode ? `, ${e.workMode}` : ""}): ${e.description}`)
    .join("\n");

  const education = educationEntries
    .map((e) => `- ${e.degree}, ${e.school} (${e.period}). ${e.highlights.join(" ")}`)
    .join("\n");

  const pubs = publicationEntries
    .map((p) => `- "${p.title}" — ${p.venuePill} (${p.status}). ${p.venueLine}`)
    .join("\n");

  const certs = certifications.map((c) => `- ${c.title} — ${c.issuer} (${c.issuedDisplay})`).join("\n");

  return `PROFILE
Name: ${profile.name}
Title: ${profile.tagline}
Headline: ${profile.headline}
Location: ${profile.location} (${profile.pronouns})
Email: ${profile.email}
GitHub: ${profile.website}
LinkedIn: https://linkedin.com/in/prajwal-reddy-34024b307
About: ${profile.about.join(" ")}
Metrics: ${heroMetrics.map((m) => `${m.value} ${m.label}`).join(", ")}

SKILLS
${skills.join(", ")}

FULL STACK / TOOLS
${stackTechnologies.map((s) => s.name).join(", ")}

EXPERIENCE
${experience}

EDUCATION
${education}

PROJECTS (${featuredProjects.length})
${projects}

PUBLICATIONS (${publicationEntries.length})
${pubs}

CERTIFICATIONS (${certifications.length})
${certs}

TIMELINE
${timeline.map((t) => `- ${t.year}: ${t.title} — ${t.body}`).join("\n")}`;
}
