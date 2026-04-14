const SLOP_PHRASES = [
  'delve into', 'delve deeper', 'it\'s worth noting', 'it is worth noting',
  'it\'s important to note', 'it is important to note', 'as an ai',
  'as a language model', 'i cannot', 'certainly!', 'absolutely!',
  'of course!', 'great question', 'i\'d be happy to', 'i would be happy to',
  'in conclusion', 'to summarize', 'in summary', 'furthermore', 'moreover',
  'in addition to', 'it goes without saying', 'needless to say',
  'at the end of the day', 'the bottom line is', 'first and foremost',
  'last but not least', 'in today\'s world', 'in today\'s society',
  'in today\'s fast-paced', 'as previously mentioned', 'as mentioned earlier',
  'it is important to', 'it is crucial to', 'it is essential to',
  'it is worth mentioning', 'with that being said', 'having said that',
  'that being said', 'all things considered', 'it should be noted',
  'it must be noted', 'rest assured', 'dive deep', 'deep dive',
  'leverage', 'utilize', 'synergy', 'paradigm shift', 'game changer',
  'game-changer', 'cutting-edge', 'state-of-the-art', 'best practices',
  'pain points', 'holistic approach', 'going forward', 'moving forward',
  'touch base', 'circle back', 'low-hanging fruit', 'think outside the box',
  'value proposition', 'robust solution', 'seamless experience', 'empower',
  'unlock the potential', 'foster', 'vibrant community', 'rich tapestry',
  'testament to', 'crucial', 'pivotal', 'groundbreaking', 'revolutionary',
  'innovative solution', 'transformative', 'comprehensive guide',
  'ultimate guide', 'navigating', 'shed light on', 'in the realm of',
  'when it comes to', 'boasts', 'it\'s clear that', 'it is clear that',
  'there\'s no denying', 'undoubtedly', 'undeniably', 'notably',
  'it\'s worth mentioning', 'on the other hand', 'in other words',
  'to put it simply', 'simply put', 'in a nutshell',
];

const GPT_OPENINGS = [
  /^certainly[,!]/i, /^absolutely[,!]/i, /^of course[,!]/i,
  /^great question/i, /^that's a great/i, /^i'd be happy/i,
  /^i would be happy/i, /^sure[,!]/i, /^as an ai/i,
  /^as a language model/i, /^i understand (that|your)/i,
];

export function analyzeHeuristics(text) {
  const lower = text.toLowerCase();
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const words = text.split(/\s+/);

  // 1. Slop phrase detection
  const foundPhrases = [];
  for (const phrase of SLOP_PHRASES) {
    let idx = lower.indexOf(phrase);
    while (idx !== -1) {
      foundPhrases.push({ phrase, index: idx, end: idx + phrase.length });
      idx = lower.indexOf(phrase, idx + 1);
    }
  }
  const uniquePhrases = [...new Map(foundPhrases.map(p => [p.phrase, p])).values()];

  // 2. Sentence uniformity
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - avgLen, 2), 0) / sentenceLengths.length;
  const stdDev = Math.sqrt(variance);
  const uniformityScore = Math.max(0, 100 - stdDev * 7);

  // 3. GPT opening
  const hasGPTOpening = GPT_OPENINGS.some(r => r.test(text.trim()));

  // 4. Passive voice
  const passiveMatches = text.match(/\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi) || [];
  const passiveRatio = passiveMatches.length / sentences.length;

  // 5. Transition density
  const transitions = ['however', 'therefore', 'furthermore', 'moreover', 'additionally',
    'consequently', 'nevertheless', 'nonetheless', 'subsequently', 'accordingly'];
  const transitionCount = transitions.filter(w => lower.includes(w)).length;
  const transitionDensity = (transitionCount / words.length) * 1000;

  // 6. Weighted score
  let score = 0;
  score += Math.min(uniquePhrases.length * 7, 40);
  score += uniformityScore * 0.25;
  score += hasGPTOpening ? 15 : 0;
  score += Math.min(passiveRatio * 15, 10);
  score += Math.min(transitionDensity * 3, 10);

  return {
    score: Math.min(Math.round(score), 100),
    foundPhrases: uniquePhrases,
    uniformityScore: Math.round(uniformityScore),
    hasGPTOpening,
    passiveRatio: +passiveRatio.toFixed(2),
    transitionDensity: +transitionDensity.toFixed(2),
    avgSentenceLength: Math.round(avgLen),
    sentenceStdDev: +stdDev.toFixed(1),
  };
}