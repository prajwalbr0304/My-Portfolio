import { featuredProjects, skills, timeline } from "@/features/portfolio/data";
import {
  isBlockedPortfolioUserQuery,
  PORTFOLIO_ASSISTANT_REFUSAL_MARKDOWN,
} from "@/lib/ai-content-safety";

interface ToolCall {
  name: string;
  args: Record<string, any>;
  result: string;
}

export interface StreamUpdate {
  chunk: string;
  thought?: string;
  toolCalls?: ToolCall[];
}

/**
 * Searches portfolio data semantically (simple string matching and rank TF-IDF mockup)
 */
function searchLocalRAG(query: string): string {
  const q = query.toLowerCase();
  
  // Search Projects
  const matchingProjects = featuredProjects.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );

  // Search Skills
  const matchingSkills = skills.filter((s) => s.toLowerCase().includes(q));

  // Search Timeline
  const matchingTimeline = timeline.filter(
    (t) => t.title.toLowerCase().includes(q) || t.body.toLowerCase().includes(q)
  );

  let response = `### Results for “${query}”\n\n`;

  if (matchingProjects.length > 0) {
    response += `#### Projects\n`;
    matchingProjects.forEach((p) => {
      response += `- **${p.title}** (${p.category}): "${p.summary}" | Impact: **${p.metric}** | Tech: ${p.tags.join(", ")}\n`;
    });
    response += `\n`;
  }

  if (matchingSkills.length > 0) {
    response += `#### Skills\n\n${matchingSkills.join(", ")}\n\n`;
  }

  if (matchingTimeline.length > 0) {
    response += `#### Timeline\n`;
    matchingTimeline.forEach((t) => {
      response += `- **${t.year} - ${t.title}**: "${t.body}"\n`;
    });
    response += `\n`;
  }

  if (
    matchingProjects.length === 0 &&
    matchingSkills.length === 0 &&
    matchingTimeline.length === 0
  ) {
    response += `No direct matches in the indexed portfolio snapshot for that phrase.\n\nTry asking about **projects** (e.g. MediTrustChain), **stack** (Next.js, Python), **experience** (Nokia), or **publications**.\n`;
  }

  return response;
}

/**
 * Simulates a multi-agent team collaborating to answer a prompt.
 */
export async function streamLocalOrchestration(
  prompt: string,
  onUpdate: (update: StreamUpdate) => void,
) {
  if (isBlockedPortfolioUserQuery(prompt)) {
    onUpdate({ chunk: PORTFOLIO_ASSISTANT_REFUSAL_MARKDOWN, thought: "" });
    return;
  }

  const p = prompt.toLowerCase();
  
  // Phase 1: Planning / Thought process
  onUpdate({
    chunk: "",
    thought: "Searching portfolio projects and skills…",
  });
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Multi-agent communication logs
  let thought = "Gathering relevant projects and experience.\n";
  thought += "Matching keywords to the public portfolio data.\n";
  thought += "Composing a concise answer.";
  
  onUpdate({
    chunk: "",
    thought,
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Determine response strategy based on query
  let finalResponse = "";
  let toolCalls: ToolCall[] = [];

  if (p.includes("search") || p.includes("project") || p.includes("skill") || p.includes("experience")) {
    // Run Search RAG tool
    const searchTerms = prompt.replace(/search|projects|find/gi, "").trim() || "AI Stack";
    thought += `\nLead Orchestrator: Executing tool [searchLocalRAG] with query: "${searchTerms}"`;
    onUpdate({ chunk: "", thought });
    
    const searchResult = searchLocalRAG(searchTerms);
    toolCalls.push({
      name: "searchLocalRAG",
      args: { query: searchTerms },
      result: "SUCCESS: Found portfolio items.",
    });
    await new Promise((resolve) => setTimeout(resolve, 600));

    finalResponse = `I called the portfolio RAG tool to search for matching records:

${searchResult}

Is there a specific project architectural trace or deep engineering signal you would like me to explain next?`;
  } 
  
  else if (p.includes("resume") || p.includes("optimize") || p.includes("fit") || p.includes("job")) {
    thought += `\nLead Orchestrator: Triggering tool [optimizeResume] to score requirements.`;
    onUpdate({ chunk: "", thought });
    
    toolCalls.push({
      name: "optimizeResume",
      args: { jobDescription: prompt },
      result: "SUCCESS: Calculated compatibility indices.",
    });
    await new Promise((resolve) => setTimeout(resolve, 600));

    finalResponse = `### 🎯 Resume-style match (simulated)

Based on the job keywords in your message:
- **Prajwal's Match Score**: **94% Compatibility** (illustrative — not tied to a real JD unless you paste one)
- **Primary strength vectors**: Shipped production AI integrations, Next.js surfaces, and data-backed project work shown on this portfolio.
- **Core alignment themes**:
  - Full-stack edge-friendly delivery
  - Vector / semantic search patterns where applicable
  - UI craft (motion, accessibility-minded layouts)

#### Custom outreach pitch (template)
> "Hi Hiring Team,
> I noticed you are seeking an AI-native engineer who balances systems precision with product taste. In my public portfolio work, I emphasize shipped projects, measurable outcomes, and clear technical writeups. I'd love to discuss how that maps to your team."

Ask for a specific **project** or **role focus** and I’ll keep the answer grounded in what’s published here.`;
  }

  else if (p.includes("architecture") || p.includes("system") || p.includes("diagram")) {
    thought += `\nLead Orchestrator: Executing tool [fetchArchitectureMap].`;
    onUpdate({ chunk: "", thought });
    
    toolCalls.push({
      name: "fetchArchitectureMap",
      args: {},
      result: "SUCCESS: Retreived system diagrams.",
    });
    await new Promise((resolve) => setTimeout(resolve, 600));

    finalResponse = `### 🏛️ Portfolio Platform Architecture Explaination

Here is the exact architectural blueprint powering this AI-Native portfolio:

1. **RSC & Streaming Shell**: Core site components are compiled statically on Next.js 15, while dynamic AI interactions hydrate inside client containers using React 19 hooks.
2. **Double-Engine Router**: Serves as a resilient router. Server endpoints utilize the Vercel AI SDK to stream OpenAI & Gemini responses. If keys are missing, it falls back seamlessly to this browser-native local orchestrator.
3. **Supabase pgvector Database**: Semantic memory embedding queries where configured.
4. **Resilient Local Memory**: Keeps context variables inside state variables and stores recurring memory tokens inside 'localStorage' for personalized persistence.

You can inspect **docs/architecture.md** in the repo for a deeper system map.`;
  }
  
  else if (p.includes("stripe") || p.includes("vercel") || p.includes("google") || p.includes("apple")) {
    const company = p.includes("stripe")
      ? "Stripe"
      : p.includes("vercel")
        ? "Vercel"
        : p.includes("google")
          ? "Google"
          : "Apple";
    thought += `\nAligning portfolio highlights with ${company}-style engineering bars.`;
    onUpdate({ chunk: "", thought });

    toolCalls.push({
      name: "alignCompanyThemes",
      args: { company },
      result: "SUCCESS: Mapped public portfolio signals to common hiring themes.",
    });
    await new Promise((resolve) => setTimeout(resolve, 600));

    finalResponse = `### Portfolio alignment: **${company}**

Here is how Prajwal’s **public portfolio data** maps to themes teams like ${company} often care about:

- **Execution speed**: Edge-friendly Next.js surfaces, streaming AI responses, and careful performance work on UI.
- **Systems depth**: Full-stack delivery with AI integration patterns and data-backed project writeups.
- **Craft**: Motion, accessibility-minded UI, and clear documentation in project pages.

Ask a specific question (a project name, stack choice, or internship) and I’ll ground the answer in what’s on this site.`;
  }

  else {
    // Default chat briefing
    finalResponse = `I’m Prajwal’s portfolio assistant. I can help with:

- **Projects & experience**: Ask about a specific build, internship, or outcome on this site.
- **Stack & architecture**: Next.js, AI streaming, data layer choices—grounded in what’s published here.
- **Publications & certifications**: Summaries from the portfolio content.

What would you like to dig into?`;
  }

  // Stream out final response
  let index = 0;
  const words = finalResponse.split(" ");
  let currentChunk = "";

  while (index < words.length) {
    const nextWords = words.slice(index, index + 3).join(" ");
    currentChunk += (index === 0 ? "" : " ") + nextWords;
    index += 3;

    onUpdate({
      chunk: currentChunk,
      thought,
      toolCalls,
    });
    
    // Smooth streaming delay
    await new Promise((resolve) => setTimeout(resolve, 34));
  }
}
