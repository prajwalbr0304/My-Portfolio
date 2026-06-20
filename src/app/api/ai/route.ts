import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  getLastUserMessageText,
  isBlockedPortfolioUserQuery,
  PORTFOLIO_ASSISTANT_REFUSAL_MARKDOWN,
} from "@/lib/ai-content-safety";
import { answerLocally, buildPortfolioContext } from "@/features/ai-copilot/lib/portfolio-knowledge";

// Node.js runtime is more reliable for outbound calls to the model providers in
// local dev (the edge runtime can throw "Connection error" reaching Google/OpenAI).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are Prajwal B R's personal AI assistant — a friendly, helpful chatbot like ChatGPT. You can help with ANY topic the user brings up: general knowledge, coding and debugging, writing, math, explanations, ideas, recommendations, and casual conversation. Answer naturally, accurately, and helpfully.

You ALSO know everything about Prajwal (a full-stack & AI developer) from the PORTFOLIO CONTEXT below. When the user asks about Prajwal — his projects, experience, skills, education, publications, or this site — use that context as the source of truth and don't invent details that aren't in it. For everything else, just answer as a capable general assistant.

SAFETY — Decline only genuinely harmful requests (sexual/adult content, instructions for violence or self-harm, illegal activity, malware, or hate/harassment) with a brief, polite refusal. Everything else is fair game.

FORMAT — Reply in clear **Markdown**: headings/bullets/numbered steps when useful, fenced code blocks for real code or commands, **bold** for key terms. Be conversational and warm; concise but complete.

=== PORTFOLIO CONTEXT (use when the user asks about Prajwal) ===
${buildPortfolioContext()}
=== END PORTFOLIO CONTEXT ===`;

function refusalResponse(encoder: TextEncoder): Response {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(PORTFOLIO_ASSISTANT_REFUSAL_MARKDOWN));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-AI-Mode": "live",
      "X-Content-Filtered": "policy",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      prompt?: string;
      messages?: { role: "user" | "assistant" | "system"; content: string }[];
      company?: string;
    };

    const prompt = body.prompt || "";
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const encoder = new TextEncoder();

    const lastUserText = getLastUserMessageText(body.messages, prompt);
    if (isBlockedPortfolioUserQuery(lastUserText)) {
      return refusalResponse(encoder);
    }

    // 1. Fallback Mode: No vendor keys configured. Signal the client to use its
    //    grounded offline assistant. We still return a grounded body so direct
    //    API consumers (curl, tests) also get a real, accurate answer.
    if (!openaiKey && !geminiKey) {
      const fallbackResponse = answerLocally(lastUserText);

      const stream = new ReadableStream({
        async start(controller) {
          const words = fallbackResponse.split(" ");
          for (let i = 0; i < words.length; i += 3) {
            const chunk = words.slice(i, i + 3).join(" ") + " ";
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 20));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-AI-Mode": "simulated",
        },
      });
    }

    // 2. Real Streaming Flow using OpenAI SDK (compatible with both OpenAI and Gemini-OpenAI interfaces)
    const client = new OpenAI({
      apiKey: openaiKey || geminiKey,
      baseURL: geminiKey && !openaiKey ? "https://generativelanguage.googleapis.com/v1beta/openai/" : undefined,
    });

    const targetModel = openaiKey ? "gpt-4o-mini" : "gemini-2.5-flash";

    const chatCompletion = await client.chat.completions.create({
      model: targetModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(body.messages || [{ role: "user", content: prompt }]),
      ],
      stream: true,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-AI-Mode": "live",
      },
    });
  } catch (error: any) {
    console.error("API streaming error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Streaming internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
