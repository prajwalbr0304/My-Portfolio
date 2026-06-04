/**
 * Server-side guardrails for the portfolio assistant.
 * Heuristic only — not a substitute for provider moderation; reduces obvious abuse.
 */

/** Markdown reply when a message is blocked before calling the model. */
export const PORTFOLIO_ASSISTANT_REFUSAL_MARKDOWN = `## Sorry — I can’t help with that

I’m only here to answer **professional questions** about Prajwal’s portfolio: projects, experience, stack, GitHub, publications, and this site.

Ask something in that area and I’ll do my best.`;

const NSFW_AND_ADULT = [
  /\b(porn|porno|nsfw|xxx|hentai|onlyfans|nude|nudes|naked|sex\s*tape|sexual|erotic|milf|bdsm|orgy|fetish|escort|prostitut)\b/i,
  /\b(18\s*\+|adult\s*content|explicit\s*scene)\b/i,
  /\b(jerk\s*off|masturbat|blow\s*job|hand\s*job|cum\s*shot|dildo|vibrator)\b/i,
];

const VIOLENCE_AND_HARM = [
  /\b(kill\s+(myself|yourself|him|her|them)|suicide|self[- ]harm|cut\s+myself)\b/i,
  /\b(how\s+to\s+make\s+a\s+bomb|build\s+a\s+bomb|terror(ist|ism)?)\b/i,
  /\b(school\s+shoot|mass\s+shoot)\b/i,
];

const ILLEGAL_AND_ABUSE = [
  /\b(hack\s+into|crack\s+password|steal\s+credit\s+card|carding|ddos\s+tool)\b/i,
  /\b(child\s+porn|cp\b|pedo|paedoph)/i,
  /\b(doxx|swatting)\b/i,
];

const HARASSMENT_SLURS = [
  /\b(n[i1]gg[ae]r|f[a@]ggot|k[i1]ke|ch[i1]nk)\b/i,
];

const ALL_PATTERNS = [
  ...NSFW_AND_ADULT,
  ...VIOLENCE_AND_HARM,
  ...ILLEGAL_AND_ABUSE,
  ...HARASSMENT_SLURS,
];

/**
 * Returns true if the user text should be blocked (no model call).
 */
export function isBlockedPortfolioUserQuery(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  const normalized = t.replace(/\s+/g, " ");
  return ALL_PATTERNS.some((re) => re.test(normalized));
}

/** Last user message from OpenAI-style chat payload. */
export function getLastUserMessageText(
  messages: { role: string; content?: string }[] | undefined,
  fallbackPrompt: string,
): string {
  if (!messages?.length) return fallbackPrompt.trim();
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user" && messages[i].content) {
      return String(messages[i].content).trim();
    }
  }
  return fallbackPrompt.trim();
}
