export interface AtsCheck {
  name: string;
  score: number;
  details: string;
  items: AtsCheckItem[];
}

export interface AtsCheckItem {
  label: string;
  passed: boolean;
  details: string;
}

export interface AtsResult {
  score: number;
  checks: AtsCheck[];
  recommendations: string[];
  missingKeywords: string[];
}

const ACTION_VERBS = new Set([
  "led", "built", "managed", "developed", "created", "designed", "implemented",
  "delivered", "launched", "improved", "increased", "reduced", "drove",
  "established", "generated", "achieved", "negotiated", "optimized",
  "spearheaded", "transformed", "engineered", "architected", "orchestrated",
  "accelerated", "expanded", "streamlined", "overhauled", "mentored",
  "trained", "coached", "pioneered", "secured", "strengthened", "unified",
  "consolidated", "automated", "pilot", "piloted", "scaled", "reorganized",
]);

const SECTION_HEADERS: { label: string; re: RegExp }[] = [
  { label: "Experience", re: /experience/i },
  { label: "Education", re: /education/i },
  { label: "Skills", re: /skills/i },
  { label: "Summary", re: /summary/i },
  { label: "Objective", re: /objective/i },
  { label: "Employment", re: /employment/i },
  { label: "Work History", re: /work\s*history/i },
  { label: "Professional Experience", re: /professional\s*experience/i },
  { label: "Certifications", re: /certifications/i },
  { label: "Projects", re: /projects/i },
  { label: "Achievements", re: /achievements/i },
  { label: "Technical Skills", re: /technical\s*skills/i },
  { label: "Core Competencies", re: /core\s*competencies/i },
];

function extractWords(text: string): string[] {
  return text.toLowerCase().split(/[\s,;.()\-/]+/).filter(Boolean);
}

function checkContactInfo(text: string): AtsCheck {
  const items: AtsCheckItem[] = [
    {
      label: "Email address",
      passed: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text),
      details: "Required for recruiters to reach you",
    },
    {
      label: "Phone number",
      passed: /(\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/.test(text),
      details: "Required for quick call scheduling",
    },
    {
      label: "LinkedIn profile",
      passed: /linkedin\.com\/in\//i.test(text),
      details: "Optional but strongly recommended",
    },
    {
      label: "Location / City",
      passed: /\b(?:city|location|remote|hybrid|onsite)\b/i.test(text),
      details: "Helps filter by location preference",
    },
  ];

  const passed = items.filter((i) => i.passed).length;
  const score = Math.round((passed / items.length) * 100);
  const ok = items.filter((i) => i.passed).map((i) => i.label);
  const missing = items.filter((i) => !i.passed).map((i) => i.label);
  const details = `${passed}/${items.length} items found.${ok.length ? " ✓ " + ok.join(", ") : ""}${missing.length ? " ✗ " + missing.join(", ") : ""}`;

  return { name: "Contact Information", score, details, items };
}

function checkSectionHeaders(text: string): AtsCheck {
  const items: (AtsCheckItem & { found: boolean })[] = SECTION_HEADERS.map(({ label, re }) => {
    const passed = re.test(text);
    return { label, passed, details: passed ? "Found" : "Missing", found: passed };
  });

  // Score based on count: 0-1 headers = 0, 2-3 = 30, 4-5 = 60, 6-7 = 80, 8+ = 100
  const count = items.filter((i) => i.found).length;
  const score =
    count >= 8 ? 100 : count >= 6 ? 80 : count >= 4 ? 60 : count >= 2 ? 30 : 0;

  const details = `${count} standard section(s) found. Aim for at least 6 (Experience, Education, Skills, Projects, Certifications, Summary).`;

  return { name: "Section Headers", score, details, items };
}

function checkActionVerbs(text: string, words?: string[]): AtsCheck {
  const w = words ?? extractWords(text);
  const found = w.filter((verb) => ACTION_VERBS.has(verb));
  const uniqueFound = new Set(found);
  const passiveIndicators = (text.match(/was\s+\w+ed|were\s+\w+ed|been\s+\w+ed/gi) || []).length;

  // Score: 0 = 0, 1 = 15, 2 = 30, 3 = 45, 4 = 60, 5 = 70, 7 = 80, 10 = 90, 15+ = 100
  const count = uniqueFound.size;
  const score =
    count >= 15 ? 100 : count >= 10 ? 90 : count >= 7 ? 80 : count >= 5 ? 70 : count >= 4 ? 60 : count >= 3 ? 45 : count >= 2 ? 30 : count >= 1 ? 15 : 0;

  // Show some of the verbs found as items
  const topVerbs = [...uniqueFound].slice(0, 8);
  const items: AtsCheckItem[] = [
    {
      label: "Strong action verbs used",
      passed: count >= 5,
      details: `Found ${count} unique action verbs: ${topVerbs.join(", ")}${uniqueFound.size > 8 ? "..." : ""}`,
    },
    {
      label: "Passive voice minimized",
      passed: passiveIndicators <= 2,
      details: `${passiveIndicators} passive constructions found (was/were ___ed). Keep under 3.`,
    },
    {
      label: "Verb variety",
      passed: count >= 7,
      details: count >= 7 ? "Good variety of different action verbs" : "Use more variety — same verbs get repetitive",
    },
  ];

  const details = `${count} unique action verb(s) found. Target: 7+ for strong results.`;

  return { name: "Action Verbs", score, details, items };
}

function checkQuantifiableResults(text: string): AtsCheck {
  const percentages = text.match(/\b\d+%|\b\d+\s*percent\b/gi) || [];
  const money = text.match(/\$\s*[\d,]+(?:k|K|m|M|b|B|[\d,.]*)?/g) || [];
  const multipliers = text.match(/\b\d+x\b/gi) || [];
  const largeNums = text.match(/\b[1-9]\d{2,}\b/g) || []; // 100+

  const totalMetrics =
    percentages.length + money.length + multipliers.length + largeNums.length;

  // Score: 0 = 0, 1 = 20, 2 = 40, 3 = 60, 5 = 80, 8+ = 100
  const score =
    totalMetrics >= 8
      ? 100
      : totalMetrics >= 5
        ? 80
        : totalMetrics >= 3
          ? 60
          : totalMetrics >= 2
            ? 40
            : totalMetrics >= 1
              ? 20
              : 0;

  const items: AtsCheckItem[] = [
    {
      label: "Percentages & growth metrics",
      passed: percentages.length >= 1,
      details: `${percentages.length} metric(s) found (e.g. "increased X by 20%")`,
    },
    {
      label: "Budget / revenue figures",
      passed: money.length >= 1,
      details: `${money.length} figure(s) found (e.g. "managed $500k budget")`,
    },
    {
      label: "Scale & scope numbers",
      passed: largeNums.length >= 1,
      details: `${largeNums.length} scale number(s) found (e.g. "led team of 50", "served 1000+ clients")`,
    },
    {
      label: "Multipliers & efficiency gains",
      passed: multipliers.length >= 1,
      details: `${multipliers.length} multiplier(s) found (e.g. "improved efficiency 3x")`,
    },
  ];

  const details = `${totalMetrics} quantifiable metric(s) found. Each bullet should have a number.`;

  return { name: "Quantifiable Results", score, details, items };
}

function checkResumeLength(text: string, words?: string[]): AtsCheck {
  const wordCount = words?.length ?? extractWords(text).length;
  // Ideal: 400-800 words (1 page). 800-1000 (2 pages). Over 1000 = too long.
  let score: number;
  if (wordCount >= 400 && wordCount <= 800) score = 100;
  else if (wordCount >= 300 && wordCount <= 1000) score = 80;
  else if (wordCount >= 200 && wordCount <= 1200) score = 50;
  else if (wordCount >= 100 && wordCount <= 1500) score = 30;
  else score = 0;

  const items: AtsCheckItem[] = [
    {
      label: "Length within 1-page range",
      passed: wordCount <= 600,
      details: `${wordCount} words — ${wordCount <= 600 ? "fits 1 page" : wordCount <= 1000 ? "fits 2 pages" : "over 2 pages"}`,
    },
    {
      label: "Not too short",
      passed: wordCount >= 200,
      details: wordCount >= 200 ? `${wordCount} words — substantive` : `${wordCount} words — too sparse`,
    },
  ];

  const details = `${wordCount} words total. Ideal range: 400-800 for 1 page.`;

  return { name: "Resume Length", score, details, items };
}

export function fileFormatCheck(filename: string): AtsCheck {
  const ext = filename.split(".").pop()?.toLowerCase();
  const score = ext === "pdf" ? 100 : ext === "docx" ? 60 : ext === "txt" ? 30 : 0;

  const items: AtsCheckItem[] = [
    {
      label: "PDF format (ATS safest)",
      passed: ext === "pdf",
      details: ext === "pdf" ? "PDF preserves formatting across all ATS" : `${ext ?? "unknown"} — convert to PDF for best results`,
    },
  ];

  const details =
    ext === "pdf"
      ? "PDF format — most ATS-friendly."
      : `${ext ?? "unknown"} format — PDF is safest for ATS parsing.`;

  return { name: "File Format", score, details, items };
}

function analyzeKeywords(
  resumeText: string,
  jobDescription?: string
): { score: number; missingKeywords: string[]; details: string; items: AtsCheckItem[] } {
  if (!jobDescription?.trim()) {
    return {
      score: 0,
      missingKeywords: [],
      details: "No job description provided — keyword matching skipped.",
      items: [{ label: "Job description provided", passed: false, details: "Paste a JD above to enable keyword matching" }],
    };
  }

  const resumeWords = new Set(extractWords(resumeText));
  const jdWords = extractWords(jobDescription);

  const commonWords = new Set([
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
    "her", "was", "one", "our", "out", "has", "have", "been", "with",
    "that", "this", "from", "they", "will", "what", "when", "where",
    "which", "their", "your", "about", "into", "than", "then", "also",
    "more", "some", "such", "than", "just", "over", "very", "would",
    "should", "could",
  ]);

  const keywords = [...new Set(jdWords.filter(
    (w) => w.length > 3 && !commonWords.has(w) && !/^\d+$/.test(w)
  ))];

  const missing = keywords.filter((w) => !resumeWords.has(w));
  const matched = keywords.length - missing.length;
  const score = keywords.length > 0 ? Math.round((matched / keywords.length) * 100) : 0;

  const items: AtsCheckItem[] = [
    {
      label: "Keyword match rate",
      passed: score >= 60,
      details: `${matched}/${keywords.length} keywords matched (${score}%)`,
    },
    {
      label: "Missing keyword count",
      passed: missing.length <= 5,
      details: `${missing.length} keyword(s) missing from your resume`,
    },
  ];

  const details =
    score >= 80
      ? `Strong match — ${matched}/${keywords.length} keywords found.`
      : score >= 50
        ? `Moderate match — ${matched}/${keywords.length} keywords found. ${missing.length} missing.`
        : `Weak match — only ${matched}/${keywords.length} keywords found. Consider tailoring your resume.`;

  return { score, missingKeywords: missing.slice(0, 20), details, items };
}

export function analyzeResumeText(
  text: string,
  filename: string,
  jobDescription?: string
): AtsResult {
  // ponytail: compute words once, reuse across checks
  const words = extractWords(text);
  let missingKeywords: string[] = [];
  const checks: AtsCheck[] = [
    checkContactInfo(text),
    checkSectionHeaders(text),
    checkActionVerbs(text, words),
    checkQuantifiableResults(text),
    checkResumeLength(text, words),
    fileFormatCheck(filename),
  ];

  if (jobDescription?.trim()) {
    const kw = analyzeKeywords(text, jobDescription);
    checks.unshift({ name: "Keyword Match", ...kw });
    missingKeywords = kw.missingKeywords;
  }

  // Weighted overall score
  const weights: Record<string, number> = {
    "Keyword Match": 20,
    "Contact Information": 25,
    "Section Headers": 15,
    "Action Verbs": 15,
    "Quantifiable Results": 15,
    "Resume Length": 5,
    "File Format": 5,
  };

  let totalScore = 0;
  let totalWeight = 0;
  for (const check of checks) {
    const w = weights[check.name] ?? 10;
    totalWeight += w;
    totalScore += w * (check.score / 100);
  }

  const overallScore = Math.round((totalScore / totalWeight) * 100);

  const recommendations = checks
    .filter((c) => c.score < 70)
    .map((c) => {
      const failing = c.items.filter((i) => !i.passed);
      if (failing.length === 0) return `Improve ${c.name.toLowerCase()} (score: ${c.score}/100).`;
      return failing.map((i) => i.label).join(", ") + ` — improve your ${c.name.toLowerCase()}.`;
    });

  return {
    score: overallScore,
    checks,
    recommendations,
    missingKeywords,
  };
}
