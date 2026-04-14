import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function classifyWithGemini(text) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const truncated = text.slice(0, 3000);

  const prompt = `You are an expert forensic linguist specializing in detecting AI-generated text. Analyze this text for signs of AI generation.

Look for:
- Formulaic or templated structure
- Lack of genuine personal voice or emotion
- AI-specific filler phrases (e.g. "delve into", "it's worth noting", "in conclusion")
- Unnaturally consistent tone and perfect grammar throughout
- Generic, vague, or overly hedged statements
- Absence of human idiosyncrasies, typos, or personality

Respond ONLY with a valid raw JSON object. No markdown. No explanation. No backticks. Just the JSON:
{
  "aiProbability": <integer 0-100>,
  "confidence": <"low" or "medium" or "high">,
  "reasons": [<2 to 4 short strings explaining your reasoning>],
  "verdict": <"human" or "likely_human" or "uncertain" or "likely_ai" or "ai">
}

Text to analyze:
"""
${truncated}
"""`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  // Strip any accidental markdown fences
  const clean = raw.replace(/```json|```/g, '').trim();

  return JSON.parse(clean);
}