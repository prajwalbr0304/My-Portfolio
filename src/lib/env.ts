// Strict Production-Grade Environment Variable Validation
const isProd = process.env.NODE_ENV === "production";

function validateEnv(key: string, value: string | undefined, fallbackAllowed = true): string {
  if (!value) {
    if (isProd && !fallbackAllowed) {
      throw new Error(
        `🚨 CRITICAL PRODUCTION ERROR: Missing environment variable "${key}". Please configure it inside Vercel Dashboard settings immediately.`
      );
    } else {
      console.warn(
        `⚠️ WARNING: Environment variable "${key}" is unconfigured. System will run in simulated/offline local fallback mode.`
      );
      return "";
    }
  }
  return value;
}

export const env = {
  supabaseUrl: validateEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: validateEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  openaiApiKey: validateEnv("OPENAI_API_KEY", process.env.OPENAI_API_KEY),
  geminiApiKey: validateEnv("GEMINI_API_KEY", process.env.GEMINI_API_KEY),
  nodeEnv: process.env.NODE_ENV || "development",
};
