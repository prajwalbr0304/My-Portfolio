import {
  isBlockedPortfolioUserQuery,
  PORTFOLIO_ASSISTANT_REFUSAL_MARKDOWN,
} from "@/lib/ai-content-safety";
import { answerLocally } from "./portfolio-knowledge";

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
 * Fully offline portfolio assistant (used when no API keys are configured).
 *
 * It now answers from a grounded knowledge base (`answerLocally`) so responses
 * are always accurate to the real portfolio data instead of generic templates.
 */
export async function streamLocalOrchestration(
  prompt: string,
  onUpdate: (update: StreamUpdate) => void,
) {
  if (isBlockedPortfolioUserQuery(prompt)) {
    onUpdate({ chunk: PORTFOLIO_ASSISTANT_REFUSAL_MARKDOWN, thought: "" });
    return;
  }

  // Phase 1: lightweight "thinking" for UX
  onUpdate({ chunk: "", thought: "Searching the portfolio knowledge base…" });
  await new Promise((resolve) => setTimeout(resolve, 450));
  onUpdate({ chunk: "", thought: "Matching your question to projects, experience, and skills…" });
  await new Promise((resolve) => setTimeout(resolve, 450));

  // Phase 2: grounded answer
  const finalResponse = answerLocally(prompt);
  const toolCalls: ToolCall[] = [
    { name: "portfolioKnowledgeBase", args: { query: prompt }, result: "SUCCESS: grounded answer composed." },
  ];

  // Phase 3: stream the answer out word-by-word for a live feel
  const words = finalResponse.split(" ");
  let currentChunk = "";
  for (let index = 0; index < words.length; index += 3) {
    const nextWords = words.slice(index, index + 3).join(" ");
    currentChunk += (index === 0 ? "" : " ") + nextWords;
    onUpdate({ chunk: currentChunk, thought: "", toolCalls });
    await new Promise((resolve) => setTimeout(resolve, 24));
  }
}
