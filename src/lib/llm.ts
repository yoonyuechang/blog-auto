const NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_KEY = process.env.NVIDIA_API_KEY || "";
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const GROQ_KEY = process.env.GROQ_API_KEY || "";

async function callNvidia(prompt: string, system?: string): Promise<string | null> {
  if (!NVIDIA_KEY) return null;
  try {
    const messages = [];
    if (system) messages.push({ role: "system", content: system });
    messages.push({ role: "user", content: prompt });
    const res = await fetch(NVIDIA_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${NVIDIA_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "nvidia/llama-3.3-70b-instruct", messages, temperature: 0.7, max_tokens: 1024 }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch { return null; }
}

async function callGemini(prompt: string, system?: string): Promise<string | null> {
  if (!GEMINI_KEY) return null;
  try {
    const body: any = { contents: [{ parts: [{ text: prompt }] }] };
    if (system) body.systemInstruction = { parts: [{ text: system }] };
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch { return null; }
}

async function callGroq(prompt: string, system?: string): Promise<string | null> {
  if (!GROQ_KEY) return null;
  try {
    const messages = [];
    if (system) messages.push({ role: "system", content: system });
    messages.push({ role: "user", content: prompt });
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3-70b-8192", messages, temperature: 0.7, max_tokens: 1024 }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch { return null; }
}

const SYSTEM_PROMPT = `당신은 IT 기술 뉴스를 분석하는 한국인 테크 라이터입니다.
다음 글을 분석하여 아래 형식으로 출력해주세요:

## 한국어 3줄 요약
(이 글의 핵심을 3줄로 요약)

## 핵심 키워드 3개
(쉼표로 구분)

## 난이도
(입문/초급 / 중급 / 고급 중 하나)`;

export async function analyzeArticle(title: string, content: string) {
  const prompt = `제목: ${title}\n\n본문: ${content.slice(0, 2000)}`;
  const results = await Promise.allSettled([
    callNvidia(prompt, SYSTEM_PROMPT),
    callGemini(prompt, SYSTEM_PROMPT),
    callGroq(prompt, SYSTEM_PROMPT),
  ]);
  for (const result of results) {
    if (result.status === "fulfilled" && result.value) {
      return parseAnalysis(result.value);
    }
  }
  return null;
}

function parseAnalysis(text: string) {
  const summaryMatch = text.match(/## 한국어 3줄 요약\n([\s\S]*?)(?=##|$)/);
  const keywordsMatch = text.match(/## 핵심 키워드 3개\n([\s\S]*?)(?=##|$)/);
  const difficultyMatch = text.match(/## 난이도\n([\s\S]*?)(?=##|$)/);
  return {
    aiSummary: summaryMatch?.[1]?.trim() || "",
    keyPoints: keywordsMatch?.[1]?.split(",").map((k) => k.trim()) || [],
    difficultyLevel: difficultyMatch?.[1]?.trim() || "입문/초급",
  };
}
