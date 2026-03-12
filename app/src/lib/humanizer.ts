// AI Humanizer Core Algorithms
// Transforms AI-generated text into natural, human-like writing

export type HumanizeMode = 'casual' | 'professional' | 'academic' | 'creative';

interface HumanizeOptions {
  mode: HumanizeMode;
  intensity: number; // 0-100
  preserveFormatting?: boolean;
}

// Common AI words/phrases and their human alternatives
const aiWordReplacements: Record<string, string[]> = {
  'utilize': ['use', 'make use of', 'work with'],
  'leverage': ['use', 'take advantage of', 'build on'],
  'facilitate': ['help', 'make easier', 'enable'],
  'implement': ['put into action', 'carry out', 'do'],
  'optimize': ['improve', 'make better', 'fine-tune'],
  'enhance': ['improve', 'boost', 'make better'],
  'demonstrate': ['show', 'prove', 'display'],
  'indicate': ['show', 'suggest', 'point to'],
  'subsequently': ['then', 'after that', 'later'],
  'furthermore': ['also', 'plus', 'what\'s more'],
  'moreover': ['also', 'besides', 'in addition'],
  'nevertheless': ['still', 'even so', 'yet'],
  'nonetheless': ['still', 'even so', 'anyway'],
  'consequently': ['so', 'as a result', 'therefore'],
  'accordingly': ['so', 'therefore'],
  'particularly': ['especially', 'mainly'],
  'specifically': ['namely', 'in particular'],
  'essentially': ['basically', 'at heart'],
  'fundamentally': ['basically', 'at its core'],
  'significantly': ['a lot', 'greatly', 'noticeably'],
  'considerably': ['a lot', 'much', 'significantly'],
  'approximately': ['about', 'around', 'roughly'],
  'numerous': ['many', 'lots of', 'plenty of'],
  'various': ['different', 'several', 'varied'],
  'diverse': ['varied', 'different', 'mixed'],
  'comprehensive': ['complete', 'thorough', 'full'],
  'robust': ['strong', 'solid', 'tough'],
  'efficient': ['effective', 'productive'],
  'effective': ['successful', 'working'],
  'innovative': ['new', 'fresh', 'creative'],
  'cutting-edge': ['latest', 'new', 'advanced'],
  'state-of-the-art': ['latest', 'modern', 'advanced'],
  'seamless': ['smooth', 'easy', 'effortless'],
  'holistic': ['complete', 'whole', 'full'],
  'synergy': ['teamwork', 'cooperation'],
  'paradigm': ['model', 'pattern', 'example'],
  'methodology': ['method', 'approach', 'way'],
  'framework': ['structure', 'system', 'approach'],
  'infrastructure': ['system', 'setup', 'foundation'],
  'ecosystem': ['system', 'environment', 'network'],
  'deliverables': ['results', 'outputs', 'work'],
  'actionable': ['useful', 'practical', 'helpful'],
  'scalable': ['expandable', 'flexible'],
  'sustainable': ['lasting', 'viable', 'enduring'],
  'strategic': ['planned', 'careful', 'tactical'],
  'proactive': ['active', 'taking initiative'],
  'reactive': ['responsive', 'responding'],
  'streamlined': ['simplified', 'smooth', 'efficient'],
  'integrated': ['combined', 'unified', 'joined'],
  'aligned': ['in line', 'matched', 'agreed'],
  'optimized': ['improved', 'enhanced', 'fine-tuned'],
  'maximized': ['increased', 'boosted', 'raised'],
  'minimized': ['reduced', 'lowered', 'decreased'],
  'prioritized': ['ranked', 'ordered', 'arranged'],
  'centralized': ['unified', 'combined'],
  'decentralized': ['distributed', 'spread out'],
  'automated': ['automatic', 'self-running'],
  'manual': ['by hand', 'human'],
  'dynamic': ['changing', 'active', 'energetic'],
  'static': ['unchanging', 'fixed', 'stable'],
};

// Contractions to make text more conversational
const contractions: Record<string, string> = {
  'do not': 'don\'t',
  'does not': 'doesn\'t',
  'did not': 'didn\'t',
  'will not': 'won\'t',
  'would not': 'wouldn\'t',
  'could not': 'couldn\'t',
  'should not': 'shouldn\'t',
  'cannot': 'can\'t',
  'is not': 'isn\'t',
  'are not': 'aren\'t',
  'was not': 'wasn\'t',
  'were not': 'weren\'t',
  'has not': 'hasn\'t',
  'have not': 'haven\'t',
  'had not': 'hadn\'t',
  'it is': 'it\'s',
  'that is': 'that\'s',
  'there is': 'there\'s',
  'what is': 'what\'s',
  'who is': 'who\'s',
  'where is': 'where\'s',
  'when is': 'when\'s',
  'why is': 'why\'s',
  'how is': 'how\'s',
  'i am': 'i\'m',
  'you are': 'you\'re',
  'we are': 'we\'re',
  'they are': 'they\'re',
  'he is': 'he\'s',
  'she is': 'she\'s',
  'i will': 'i\'ll',
  'you will': 'you\'ll',
  'we will': 'we\'ll',
  'they will': 'they\'ll',
  'he will': 'he\'ll',
  'she will': 'she\'ll',
  'it will': 'it\'ll',
  'that will': 'that\'ll',
  'there will': 'there\'ll',
  'i would': 'i\'d',
  'you would': 'you\'d',
  'we would': 'we\'d',
  'they would': 'they\'d',
  'he would': 'he\'d',
  'she would': 'she\'d',
  'it would': 'it\'d',
  'i have': 'i\'ve',
  'you have': 'you\'ve',
  'we have': 'we\'ve',
  'they have': 'they\'ve',
  'could have': 'could\'ve',
  'would have': 'would\'ve',
  'should have': 'should\'ve',
  'might have': 'might\'ve',
  'must have': 'must\'ve',
  'let us': 'let\'s',
  'you all': 'y\'all',
};

// Casual fillers for conversational tone
const casualFillers = [
  'you know,',
  'like,',
  'honestly,',
  'basically,',
  'I mean,',
  'sort of',
  'kind of',
  'pretty much',
  'just',
  'really',
  'actually,',
  'to be honest,',
  'frankly,',
  'truth be told,',
];

// Sentence starters for variety
const casualStarters = [
  'So,',
  'Well,',
  'Look,',
  'You know what?',
  'Here\'s the thing:',
  'Honestly,',
  'Basically,',
  'I mean,',
  'Truth is,',
  'Thing is,',
  'Bottom line,',
  'At the end of the day,',
];

// Professional but human alternatives
const professionalStarters = [
  'Let\'s look at',
  'Here\'s something to consider:',
  'The reality is,',
  'What matters is',
  'It\'s worth noting that',
  'Importantly,',
  'Keep in mind that',
  'Remember,',
];

// Academic but human alternatives
const academicStarters = [
  'It\'s important to note',
  'One might argue',
  'Consider that',
  'The evidence suggests',
  'Research indicates',
  'Studies show',
  'It\'s worth examining',
  'A key point is',
];

// Creative expressions
const creativeFillers = [
  'imagine this:',
  'picture it:',
  'here\'s the kicker:',
  'get this:',
  'believe it or not,',
  'wildly enough,',
  'crazy as it sounds,',
];

// Overly formal transitions to break up
const formalTransitions = [
  'in conclusion',
  'to summarize',
  'in summary',
  'all in all',
  'to conclude',
  'in closing',
  'ultimately',
  'at the end of the day',
];

// Helper: Random integer between min and max
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper: Random item from array
const randomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Helper: Should apply based on intensity
const shouldApply = (intensity: number): boolean => {
  return Math.random() * 100 < intensity;
};

// Split text into sentences
const splitSentences = (text: string): string[] => {
  // Simple sentence splitting, handles common cases
  return text
    .replace(/([.!?])\s+(?=[A-Z])/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 0);
};

// Join sentences back together
const joinSentences = (sentences: string[]): string => {
  return sentences.join(' ');
};

// Apply word replacements
const applyWordReplacements = (text: string, intensity: number): string => {
  let result = text;
  
  Object.entries(aiWordReplacements).forEach(([aiWord, alternatives]) => {
    const regex = new RegExp(`\\b${aiWord}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      if (shouldApply(intensity * 0.8)) {
        const replacement = randomItem(alternatives);
        // Preserve original case
        if (match[0] === match[0].toUpperCase()) {
          return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
      }
      return match;
    });
  });
  
  return result;
};

// Apply contractions
const applyContractions = (text: string, intensity: number): string => {
  let result = text;
  
  Object.entries(contractions).forEach(([full, contracted]) => {
    const regex = new RegExp(`\\b${full}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      if (shouldApply(intensity * 0.9)) {
        // Preserve original case
        if (match[0] === match[0].toUpperCase()) {
          return contracted.charAt(0).toUpperCase() + contracted.slice(1);
        }
        return contracted;
      }
      return match;
    });
  });
  
  return result;
};

// Vary sentence length by combining or splitting
const varySentenceLength = (sentences: string[], intensity: number): string[] => {
  if (intensity < 30) return sentences;
  
  const result: string[] = [];
  let i = 0;
  
  while (i < sentences.length) {
    const current = sentences[i];
    
    // Occasionally combine short sentences
    if (
      i < sentences.length - 1 &&
      current.length < 50 &&
      sentences[i + 1].length < 50 &&
      shouldApply(intensity * 0.3)
    ) {
      const combined = `${current} and ${sentences[i + 1].toLowerCase()}`;
      result.push(combined);
      i += 2;
    } else {
      result.push(current);
      i++;
    }
  }
  
  return result;
};

// Add casual fillers
const addCasualFillers = (text: string, intensity: number): string => {
  if (intensity < 40) return text;
  
  let result = text;
  
  // Add fillers at the beginning occasionally
  if (shouldApply(intensity * 0.2)) {
    result = `${randomItem(casualFillers)} ${result.charAt(0).toLowerCase() + result.slice(1)}`;
  }
  
  // Add fillers within sentences
  casualFillers.forEach(filler => {
    const regex = new RegExp(`(\\w+\\s+\\w+)`, 'g');
    let matchCount = 0;
    result = result.replace(regex, (match, p1) => {
      matchCount++;
      if (matchCount % randomInt(3, 6) === 0 && shouldApply(intensity * 0.15)) {
        return `${p1} ${filler}`;
      }
      return match;
    });
  });
  
  return result;
};

// Add sentence starters based on mode
const addSentenceStarters = (sentences: string[], mode: HumanizeMode, intensity: number): string[] => {
  if (intensity < 30 || sentences.length === 0) return sentences;
  
  const starters = mode === 'casual' 
    ? casualStarters 
    : mode === 'professional' 
    ? professionalStarters 
    : mode === 'academic'
    ? academicStarters
    : [...casualStarters, ...creativeFillers];
  
  return sentences.map((sentence, index) => {
    if (index === 0) return sentence; // Don't modify first sentence
    if (shouldApply(intensity * 0.25)) {
      const starter = randomItem(starters);
      // Make sure first letter is lowercase after starter
      const rest = sentence.charAt(0).toLowerCase() + sentence.slice(1);
      return `${starter} ${rest}`;
    }
    return sentence;
  });
};

// Break up overly formal transitions
const breakFormalTransitions = (text: string, intensity: number): string => {
  if (intensity < 50) return text;
  
  let result = text;
  
  formalTransitions.forEach(transition => {
    const regex = new RegExp(`\\b${transition}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      if (shouldApply(intensity * 0.4)) {
        return randomItem(['so', 'basically', 'in the end', '']);
      }
      return match;
    });
  });
  
  return result;
};

// Add natural imperfections (occasional grammar quirks)
const addNaturalImperfections = (text: string, intensity: number): string => {
  if (intensity < 60) return text;
  
  let result = text;
  
  // Occasionally start sentences with "And" or "But"
  const sentences = splitSentences(result);
  const modifiedSentences = sentences.map((sentence, index) => {
    if (index > 0 && shouldApply(intensity * 0.15)) {
      const starter = randomItem(['And', 'But', 'Or']);
      return `${starter} ${sentence.charAt(0).toLowerCase() + sentence.slice(1)}`;
    }
    return sentence;
  });
  
  result = joinSentences(modifiedSentences);
  
  // Occasionally use "got" instead of "have"
  result = result.replace(/\bhave\b/gi, (match) => {
    if (shouldApply(intensity * 0.1)) {
      return 'got';
    }
    return match;
  });
  
  // Occasionally use "gonna" or "wanna" in casual mode
  result = result.replace(/\bgoing to\b/gi, (match) => {
    if (shouldApply(intensity * 0.15)) {
      return 'gonna';
    }
    return match;
  });
  
  result = result.replace(/\bwant to\b/gi, (match) => {
    if (shouldApply(intensity * 0.15)) {
      return 'wanna';
    }
    return match;
  });
  
  return result;
};

// Vary punctuation
const varyPunctuation = (text: string, intensity: number): string => {
  if (intensity < 40) return text;
  
  let result = text;
  
  // Occasionally use em-dashes
  result = result.replace(/\s+-\s+/g, (match) => {
    if (shouldApply(intensity * 0.2)) {
      return ' — ';
    }
    return match;
  });
  
  // Occasionally use parentheses for asides
  const sentences = splitSentences(result);
  const modifiedSentences = sentences.map(sentence => {
    if (sentence.length > 80 && shouldApply(intensity * 0.15)) {
      const words = sentence.split(' ');
      if (words.length > 10) {
        const insertPoint = randomInt(3, words.length - 3);
        const asideLength = randomInt(2, 4);
        const aside = words.slice(insertPoint, insertPoint + asideLength).join(' ');
        words.splice(insertPoint, asideLength, `(${aside})`);
        return words.join(' ');
      }
    }
    return sentence;
  });
  
  return joinSentences(modifiedSentences);
};

// Remove repetitive sentence structures
const removeRepetitivePatterns = (text: string, intensity: number): string => {
  if (intensity < 50) return text;
  
  // Detect and vary sentences starting with the same pattern
  const sentences = splitSentences(text);
  const starters: string[] = [];
  
  return joinSentences(
    sentences.map((sentence) => {
      const firstTwoWords = sentence.split(' ').slice(0, 2).join(' ').toLowerCase();
      
      if (starters.includes(firstTwoWords) && shouldApply(intensity * 0.5)) {
        // Vary the sentence structure
        if (sentence.includes(' is ')) {
          return sentence.replace(/^(\w+\s+\w+\s+is\s+)/i, 'There\'s ');
        }
        if (sentence.includes(' can ')) {
          return sentence.replace(/^(\w+\s+\w+\s+can\s+)/i, 'It\'s possible for $1 to ');
        }
      }
      
      starters.push(firstTwoWords);
      return sentence;
    })
  );
};

// Main humanization function
export const humanizeText = (text: string, options: HumanizeOptions): string => {
  const { mode, intensity } = options;
  
  if (!text.trim()) return '';
  
  let result = text;
  
  // Step 1: Apply word replacements (reduce AI-sounding vocabulary)
  result = applyWordReplacements(result, intensity);
  
  // Step 2: Apply contractions (make more conversational)
  if (mode !== 'academic') {
    result = applyContractions(result, intensity);
  }
  
  // Step 3: Split into sentences for sentence-level processing
  let sentences = splitSentences(result);
  
  // Step 4: Vary sentence length
  sentences = varySentenceLength(sentences, intensity);
  
  // Step 5: Add sentence starters
  sentences = addSentenceStarters(sentences, mode, intensity);
  
  // Step 6: Join back
  result = joinSentences(sentences);
  
  // Step 7: Break up formal transitions
  result = breakFormalTransitions(result, intensity);
  
  // Step 8: Add casual fillers (mode-dependent)
  if (mode === 'casual' || mode === 'creative') {
    result = addCasualFillers(result, intensity);
  }
  
  // Step 9: Add natural imperfections (casual/creative only)
  if (mode === 'casual' || mode === 'creative') {
    result = addNaturalImperfections(result, intensity);
  }
  
  // Step 10: Vary punctuation
  result = varyPunctuation(result, intensity);
  
  // Step 11: Remove repetitive patterns
  result = removeRepetitivePatterns(result, intensity);
  
  // Final cleanup: fix spacing and capitalization
  result = result
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?])/g, '$1')
    .replace(/([.!?])\s+([a-z])/g, (_, p1, p2) => `${p1} ${p2.toUpperCase()}`)
    .trim();
  
  // Ensure first letter is capitalized
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  
  return result;
};

// Calculate humanization score (estimated)
export const calculateHumanScore = (text: string): number => {
  let score = 50; // Base score
  
  // Check for contractions (+10 points)
  const contractionCount = (text.match(/\w+'\w+/g) || []).length;
  score += Math.min(contractionCount * 2, 15);
  
  // Check for varied sentence lengths (+10 points)
  const sentences = splitSentences(text);
  const lengths = sentences.map(s => s.length);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
  if (variance > 500) score += 10;
  
  // Check for AI words (-5 points each)
  Object.keys(aiWordReplacements).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) score -= matches.length * 3;
  });
  
  // Check for sentence variety (+10 points)
  const uniqueStarters = new Set(sentences.map(s => s.split(' ')[0].toLowerCase()));
  if (uniqueStarters.size > sentences.length * 0.7) score += 10;
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Get word count
export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

// Get character count
export const getCharCount = (text: string): number => {
  return text.length;
};
