export function analyzeEntropy(text) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const chars = text.toLowerCase().replace(/\s/g, '');

  if (words.length < 10) {
    return { score: 50, charEntropy: 0, wordEntropy: 0, burstiness: 0, typeTokenRatio: 0, uniqueWords: 0, totalWords: words.length };
  }

  // Shannon char entropy
  const charFreq = {};
  for (const c of chars) charFreq[c] = (charFreq[c] || 0) + 1;
  const charEntropy = -Object.values(charFreq).reduce((sum, n) => {
    const p = n / chars.length;
    return sum + p * Math.log2(p);
  }, 0);

  // Word entropy
  const wordFreq = {};
  for (const w of words) wordFreq[w] = (wordFreq[w] || 0) + 1;
  const wordEntropy = -Object.values(wordFreq).reduce((sum, n) => {
    const p = n / words.length;
    return sum + p * Math.log2(p);
  }, 0);

  // Burstiness: B = (σ - μ) / (σ + μ) of inter-word gaps
  const gaps = computeWordGaps(words);
  const burstiness = computeBurstiness(gaps);

  // Type-Token Ratio
  const uniqueWords = Object.keys(wordFreq).length;
  const ttr = uniqueWords / words.length;

  // Score: lower entropy/burstiness/ttr → higher AI probability
  const entropyScore = Math.max(0, Math.min(100, (4.2 - charEntropy) * 60));
  const burstyScore = Math.max(0, Math.min(100, (0.1 - burstiness) * 200));
  const ttrScore = Math.max(0, Math.min(100, (0.55 - ttr) * 200));
  const combined = Math.round(entropyScore * 0.3 + burstyScore * 0.4 + ttrScore * 0.3);

  return {
    score: Math.min(Math.max(combined, 0), 100),
    charEntropy: +charEntropy.toFixed(2),
    wordEntropy: +wordEntropy.toFixed(2),
    burstiness: +burstiness.toFixed(3),
    typeTokenRatio: +ttr.toFixed(3),
    uniqueWords,
    totalWords: words.length,
  };
}

function computeWordGaps(words) {
  const positions = {};
  words.forEach((w, i) => {
    if (!positions[w]) positions[w] = [];
    positions[w].push(i);
  });
  const gaps = [];
  for (const pos of Object.values(positions)) {
    if (pos.length > 1) {
      for (let i = 1; i < pos.length; i++) gaps.push(pos[i] - pos[i - 1]);
    }
  }
  return gaps.length > 1 ? gaps : [1, 2];
}

function computeBurstiness(gaps) {
  const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const std = Math.sqrt(gaps.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / gaps.length);
  const denom = std + mean;
  return denom === 0 ? 0 : (std - mean) / denom;
}