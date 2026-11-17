import type { ToolCategory, ToolDefinition } from "@/types/tools";

export const toolCategories: ToolCategory[] = [
  {
    id: "text",
    title: "Text tools",
    description: "Transform, count, compare and clean text.",
  },
  {
    id: "developer",
    title: "Developer tools",
    description: "Formatters, generators and encoding utilities.",
  },
  {
    id: "data",
    title: "Data tools",
    description: "CSV, profiling and analytics helpers.",
  },
  {
    id: "ai-ml",
    title: "AI & ML tools",
    description: "Prompt, token, similarity and metrics utilities.",
  },
  {
    id: "image-pdf",
    title: "Image & PDF",
    description: "Compression, conversion and document helpers.",
  },
  {
    id: "student",
    title: "Student tools",
    description: "Calculators and study utilities.",
  },
  {
    id: "sri-lanka",
    title: "Sri Lankan utilities",
    description: "Local salary, tax and cost helpers.",
  },
];

/** Phase 4 batch — fully implemented in-browser tools. */
export const tools: ToolDefinition[] = [
  {
    slug: "word-counter",
    title: "Word Counter",
    description: "Count words, characters, sentences and paragraphs instantly.",
    category: "text",
    keywords: ["words", "count", "writing"],
    implemented: true,
    faqs: [
      {
        question: "How are words counted?",
        answer:
          "Words are counted by splitting on whitespace after normalizing the text.",
      },
    ],
  },
  {
    slug: "character-counter",
    title: "Character Counter",
    description: "Count characters with and without spaces.",
    category: "text",
    keywords: ["characters", "length"],
    implemented: true,
  },
  {
    slug: "text-case-converter",
    title: "Text Case Converter",
    description: "Convert text to upper, lower, title, sentence and more.",
    category: "text",
    keywords: ["case", "uppercase", "lowercase"],
    implemented: true,
  },
  {
    slug: "slug-generator",
    title: "Slug Generator",
    description: "Generate URL-friendly slugs from any title or phrase.",
    category: "text",
    keywords: ["slug", "url", "seo"],
    implemented: true,
  },
  {
    slug: "text-diff",
    title: "Text Diff",
    description: "Compare two text blocks and highlight line-level differences.",
    category: "text",
    keywords: ["diff", "compare"],
    implemented: true,
  },
  {
    slug: "duplicate-line-remover",
    title: "Duplicate Line Remover",
    description: "Remove duplicate lines while optionally preserving order.",
    category: "text",
    keywords: ["unique", "dedupe"],
    implemented: true,
  },
  {
    slug: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder paragraphs for layouts and wireframes.",
    category: "text",
    keywords: ["lorem", "placeholder"],
    implemented: true,
  },
  {
    slug: "base64-converter",
    title: "Base64 Converter",
    description: "Encode and decode Base64 text in the browser.",
    category: "text",
    keywords: ["base64", "encode", "decode"],
    implemented: true,
  },
  {
    slug: "url-encoder",
    title: "URL Encoder / Decoder",
    description: "Encode or decode URI components safely.",
    category: "text",
    keywords: ["url", "encode", "percent"],
    implemented: true,
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description: "Pretty-print or minify JSON with validation feedback.",
    category: "developer",
    keywords: ["json", "format", "pretty"],
    implemented: true,
  },
  {
    slug: "json-validator",
    title: "JSON Validator",
    description: "Validate JSON and surface parse errors clearly.",
    category: "developer",
    keywords: ["json", "validate"],
    implemented: true,
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    description: "Generate UUID v4 identifiers locally.",
    category: "developer",
    keywords: ["uuid", "guid"],
    implemented: true,
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    description: "Generate SHA-256 and SHA-1 hashes using Web Crypto.",
    category: "developer",
    keywords: ["hash", "sha", "crypto"],
    implemented: true,
  },
  {
    slug: "password-generator",
    title: "Password Generator",
    description: "Create strong random passwords with configurable options.",
    category: "developer",
    keywords: ["password", "security"],
    implemented: true,
  },
  {
    slug: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert between Unix timestamps and human-readable dates.",
    category: "developer",
    keywords: ["unix", "epoch", "time"],
    implemented: true,
  },
  {
    slug: "color-converter",
    title: "Color Converter",
    description: "Convert between HEX, RGB and HSL color formats.",
    category: "developer",
    keywords: ["color", "hex", "rgb", "hsl"],
    implemented: true,
  },
  {
    slug: "csv-to-json",
    title: "CSV to JSON",
    description: "Convert CSV text into JSON arrays in the browser.",
    category: "data",
    keywords: ["csv", "json", "convert"],
    implemented: true,
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    description: "Test regular expressions against sample input text.",
    category: "developer",
    keywords: ["regex", "pattern"],
    implemented: true,
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode JWT header and payload without verifying signatures.",
    category: "developer",
    keywords: ["jwt", "token"],
    implemented: true,
    faqs: [
      {
        question: "Does this verify signatures?",
        answer:
          "No. This tool only decodes Base64URL segments for inspection. It does not validate authenticity.",
      },
    ],
  },
  {
    slug: "token-estimator",
    title: "Token Estimator",
    description:
      "Estimate approximate LLM token counts using a practical heuristic.",
    category: "ai-ml",
    keywords: ["tokens", "llm", "cost"],
    implemented: true,
    faqs: [
      {
        question: "Is this exact?",
        answer:
          "No. Tokenization differs by model. This estimator uses a transparent character/word heuristic for planning only.",
      },
    ],
  },
];

export function getImplementedTools() {
  return tools.filter((tool) => tool.implemented);
}

export function getToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug) ?? null;
}

export function getToolsByCategory(categoryId: string) {
  return tools.filter((tool) => tool.category === categoryId && tool.implemented);
}

export function getRelatedTools(slug: string, limit = 4) {
  const current = getToolBySlug(slug);
  if (!current) return [];
  return getImplementedTools()
    .filter((tool) => tool.slug !== slug && tool.category === current.category)
    .slice(0, limit);
}

export function searchTools(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return getImplementedTools();
  return getImplementedTools().filter((tool) => {
    const haystack = [
      tool.title,
      tool.description,
      tool.category,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
