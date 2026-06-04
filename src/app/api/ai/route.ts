import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  getLastUserMessageText,
  isBlockedPortfolioUserQuery,
  PORTFOLIO_ASSISTANT_REFUSAL_MARKDOWN,
} from "@/lib/ai-content-safety";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are the portfolio assistant for Prajwal B R (full-stack & AI developer).

SCOPE — Only discuss: Prajwal’s projects, GitHub repos, internships/jobs as shown on the site, education, publications, skills/stack, and how this portfolio is built. If asked for unrelated general knowledge, politics, medical/legal advice, or anything outside that scope, politely refuse in one short paragraph and suggest a portfolio-related question instead.

SAFETY — If the user asks for sexual or adult (18+) content, violence, hate, self-harm instructions, illegal activity, malware, or harassment: refuse. Reply briefly with a polite apology that you cannot help with that topic. Do not describe or engage with the harmful request.

GROUNDING — Do not invent employers, dates, or metrics. If unknown, say so briefly.

Format answers like a high-quality ChatGPT reply:
- Use clear **Markdown** (## / ### headings, bullets, numbered steps when useful).
- Prefer concise paragraphs; **bold** key terms; fenced code blocks only for real code or commands.
- Stay professional; avoid emoji-heavy lines.`;

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

    // 1. Fallback Mode: If no keys are configured, stream an instructional response guiding local fallback
    if (!openaiKey && !geminiKey) {
      const fallbackResponse = `### [EDGE SYNC FALLBACK ACTIVE]

Hello! I see you are running the project locally without API keys. 

To enable real-time model streaming, please add your keys to your \`.env.local\` file:
\`\`\`bash
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
\`\`\`

**No worries!** The portfolio’s **local assistant** can still answer from public site context while you develop without vendor keys.

How can I help you explore Prajwal’s projects and experience today?`;

      const stream = new ReadableStream({
        async start(controller) {
          // Stream word by word to simulate real edge delivery
          const words = fallbackResponse.split(" ");
          for (let i = 0; i < words.length; i += 3) {
            const chunk = words.slice(i, i + 3).join(" ") + " ";
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 30));
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
