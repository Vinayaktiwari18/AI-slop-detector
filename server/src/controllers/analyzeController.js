import { analyzeHeuristics } from '../services/heuristicService.js';
import { analyzeEntropy } from '../services/entropyService.js';
import { classifyWithGemini } from '../services/geminiService.js';
import { scrapeUrl } from '../services/urlScraperService.js';
import { parseFile } from '../services/fileParserService.js';

export async function analyzeText(req, res) {
  const { text, url } = req.body;
  const file = req.file;
  let inputText = '';
  let source = 'text';
  let metadata = {};

  try {
    // --- Resolve input source ---
    if (url && url.trim()) {
      const scraped = await scrapeUrl(url.trim());
      inputText = scraped.text;
      metadata.title = scraped.title;
      metadata.url = url.trim();
      source = 'url';
    } else if (file) {
      inputText = await parseFile(file.buffer, file.mimetype, file.originalname);
      metadata.filename = file.originalname;
      metadata.size = file.size;
      source = 'file';
    } else if (text && text.trim()) {
      inputText = text.trim();
      source = 'text';
    } else {
      return res.status(400).json({ error: 'Provide text, a URL, or upload a file.' });
    }

    if (inputText.length < 50) {
      return res.status(400).json({ error: 'Text too short. Provide at least 50 characters.' });
    }

    // --- Run fast analyses first ---
    const heuristics = analyzeHeuristics(inputText);
    const entropy = analyzeEntropy(inputText);

    // --- Gemini AI classification (with graceful fallback) ---
    let gemini = null;
    try {
      gemini = await classifyWithGemini(inputText);
    } catch (e) {
      console.warn('[Gemini] Skipped:', e.message);
    }

    // --- Weighted final score ---
    const finalScore = gemini
      ? Math.round(heuristics.score * 0.30 + entropy.score * 0.25 + gemini.aiProbability * 0.45)
      : Math.round(heuristics.score * 0.55 + entropy.score * 0.45);

    const verdict = getVerdict(Math.min(Math.max(finalScore, 0), 100));

    res.json({
      finalScore: Math.min(Math.max(finalScore, 0), 100),
      verdict,
      source,
      metadata,
      textLength: inputText.length,
      wordCount: inputText.split(/\s+/).filter(Boolean).length,
      signals: {
        heuristics,
        entropy,
        gemini,
      },
      analyzedText: inputText.slice(0, 6000),
    });

  } catch (err) {
    console.error('[analyzeText]', err.message);
    res.status(500).json({ error: err.message });
  }
}

function getVerdict(score) {
  if (score < 20) return { label: 'Human Written',    color: '#00ff88', level: 1 };
  if (score < 40) return { label: 'Likely Human',     color: '#a3e635', level: 2 };
  if (score < 60) return { label: 'Uncertain',         color: '#facc15', level: 3 };
  if (score < 80) return { label: 'Likely AI Slop',   color: '#fb923c', level: 4 };
  return           { label: 'AI Slop Detected',       color: '#f43f5e', level: 5 };
}