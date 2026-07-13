const required = ["DATABASE_URL"] as const;
const optional = [
  "DIRECT_URL",
  "NVIDIA_API_KEY",
  "GEMINI_KEY",
  "GEMINI_API_KEY",
  "GROQ_KEY",
  "REVALIDATE_SECRET",
  "NODE_ENV",
] as const;

type RequiredEnv = (typeof required)[number];
type OptionalEnv = (typeof optional)[number];
type Env = Record<RequiredEnv, string> & Record<OptionalEnv, string | undefined>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;

  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  _env = Object.fromEntries([
    ...required.map((k) => [k, process.env[k] as string]),
    ...optional.map((k) => [k, process.env[k]]),
  ]) as Env;

  return _env;
}
