import type { ToolCategory, ToolDefinition } from "@/types/tools";

export const toolCategories: ToolCategory[] = [
  { id: "text", title: "Text tools", description: "Transform, count, compare and clean text." },
  { id: "developer", title: "Developer tools", description: "Formatters, generators and encoding utilities." },
  { id: "data", title: "Data tools", description: "CSV, profiling and analytics helpers." },
  { id: "ai-ml", title: "AI & ML tools", description: "Prompt, token, similarity and metrics utilities." },
  { id: "image-pdf", title: "Image & PDF", description: "Compression, conversion and document helpers." },
  { id: "student", title: "Student tools", description: "Calculators and study utilities." },
  { id: "sri-lanka", title: "Sri Lankan utilities", description: "Local salary, tax and cost helpers." },
];

function t(
  slug: string,
  title: string,
  description: string,
  category: ToolDefinition["category"],
  keywords: string[],
  faqs?: ToolDefinition["faqs"]
): ToolDefinition {
  return { slug, title, description, category, keywords, implemented: true, faqs };
}

export const tools: ToolDefinition[] = [
  // Text
  t("word-counter", "Word Counter", "Count words, characters, sentences and paragraphs instantly.", "text", ["words", "count"]),
  t("character-counter", "Character Counter", "Count characters with and without spaces.", "text", ["characters", "length"]),
  t("text-case-converter", "Text Case Converter", "Convert text to upper, lower, title and sentence case.", "text", ["case"]),
  t("text-diff", "Text Diff", "Compare two text blocks and highlight line-level differences.", "text", ["diff"]),
  t("duplicate-line-remover", "Duplicate Line Remover", "Remove duplicate lines while preserving order.", "text", ["unique"]),
  t("text-sorter", "Text Sorter", "Sort lines alphabetically ascending or descending.", "text", ["sort"]),
  t("slug-generator", "Slug Generator", "Generate URL-friendly slugs from any title.", "text", ["slug", "seo"]),
  t("lorem-ipsum", "Lorem Ipsum Generator", "Generate placeholder paragraphs for layouts.", "text", ["lorem"]),
  t("readability-checker", "Readability Checker", "Estimate reading ease from sentence and word length.", "text", ["readability"]),
  t("markdown-editor", "Markdown Editor", "Write Markdown and preview rendered HTML locally.", "text", ["markdown"]),
  t("base64-converter", "Base64 Converter", "Encode and decode Base64 text in the browser.", "text", ["base64"]),
  t("url-encoder", "URL Encoder / Decoder", "Encode or decode URI components safely.", "text", ["url"]),

  // Developer
  t("json-formatter", "JSON Formatter", "Pretty-print or minify JSON with validation feedback.", "developer", ["json"]),
  t("json-validator", "JSON Validator", "Validate JSON and surface parse errors clearly.", "developer", ["json", "validate"]),
  t("xml-formatter", "XML Formatter", "Pretty-print XML-like markup locally.", "developer", ["xml"]),
  t("yaml-converter", "YAML Converter", "Convert between YAML and JSON in the browser.", "developer", ["yaml"]),
  t("csv-to-json", "CSV to JSON", "Convert CSV text into JSON arrays.", "data", ["csv", "json"]),
  t("uuid-generator", "UUID Generator", "Generate UUID v4 identifiers locally.", "developer", ["uuid"]),
  t("jwt-decoder", "JWT Decoder", "Decode JWT header and payload without verifying signatures.", "developer", ["jwt"], [
    { question: "Does this verify signatures?", answer: "No. It only decodes Base64URL segments for inspection." },
  ]),
  t("regex-tester", "Regex Tester", "Test regular expressions against sample input.", "developer", ["regex"]),
  t("sql-formatter", "SQL Formatter", "Pretty-print SQL queries locally.", "developer", ["sql"]),
  t("timestamp-converter", "Timestamp Converter", "Convert between Unix timestamps and ISO dates.", "developer", ["unix"]),
  t("cron-generator", "Cron Generator", "Build cron expressions with human-readable summaries.", "developer", ["cron"]),
  t("hash-generator", "Hash Generator", "Generate SHA-256 and SHA-1 hashes using Web Crypto.", "developer", ["hash"]),
  t("password-generator", "Password Generator", "Create strong random passwords with options.", "developer", ["password"]),
  t("color-converter", "Color Converter", "Convert between HEX, RGB and HSL.", "developer", ["color"]),
  t("css-gradient-generator", "CSS Gradient Generator", "Build CSS linear gradients visually.", "developer", ["css", "gradient"]),
  t("html-playground", "HTML Playground", "Experiment with HTML snippets in a live preview.", "developer", ["html"]),
  t("qr-code-generator", "QR Code Generator", "Generate QR codes from text in the browser.", "developer", ["qr"]),
  t("git-command-reference", "Git Command Reference", "Search common Git commands and examples.", "developer", ["git"]),
  t("dockerfile-generator", "Dockerfile Generator", "Generate a starter Dockerfile from options.", "developer", ["docker"]),

  // Data
  t("csv-analyzer", "CSV Analyzer", "Summarize CSV columns, types and basic stats.", "data", ["csv", "analyze"]),
  t("csv-viewer", "CSV Viewer", "View CSV data in a readable table.", "data", ["csv", "table"]),
  t("data-profiler", "Data Profiler", "Profile column completeness and uniqueness.", "data", ["profile"]),
  t("missing-value-analyzer", "Missing Value Analyzer", "Measure missing values per CSV column.", "data", ["missing"]),
  t("duplicate-detector", "Duplicate Detector", "Find duplicate rows in CSV data.", "data", ["duplicate"]),
  t("data-cleaning", "Data Cleaning", "Trim, dedupe and normalize CSV text.", "data", ["clean"]),
  t("descriptive-statistics", "Descriptive Statistics", "Mean, median, min, max and std deviation.", "data", ["stats"]),
  t("correlation-calculator", "Correlation Calculator", "Pearson correlation between two numeric columns.", "data", ["correlation"]),
  t("outlier-detector", "Outlier Detector", "Flag outliers using a z-score threshold.", "data", ["outlier"]),
  t("data-visualization", "Data Visualization", "Render simple bar charts from CSV values.", "data", ["chart"]),
  t("pivot-table-simulator", "Pivot Table Simulator", "Group CSV rows and aggregate a numeric column.", "data", ["pivot"]),
  t("excel-formula-helper", "Excel Formula Helper", "Lookup common Excel formulas and patterns.", "data", ["excel"]),
  t("dax-formula-helper", "DAX Formula Helper", "Lookup common DAX patterns for Power BI.", "data", ["dax"]),
  t("sql-query-helper", "SQL Query Helper", "Browse common SQL query templates.", "data", ["sql"]),
  t("date-table-generator", "Date Table Generator", "Generate a date dimension CSV for analytics.", "data", ["date"]),
  t("data-quality-report", "Data Quality Report", "Generate a quick CSV quality summary.", "data", ["quality"]),

  // AI / ML
  t("prompt-builder", "Prompt Builder", "Assemble role, task, constraints and output format prompts.", "ai-ml", ["prompt"]),
  t("token-estimator", "Token Estimator", "Estimate approximate LLM token counts.", "ai-ml", ["tokens"], [
    { question: "Is this exact?", answer: "No. It uses a transparent heuristic for planning only." },
  ]),
  t("ai-cost-calculator", "AI Cost Calculator", "Estimate API cost from token counts and unit prices.", "ai-ml", ["cost"]),
  t("embedding-explorer", "Embedding Explorer", "Build simple bag-of-words vectors from text.", "ai-ml", ["embedding"]),
  t("cosine-similarity-calculator", "Cosine Similarity Calculator", "Compute cosine similarity between two vectors.", "ai-ml", ["cosine"]),
  t("text-similarity", "Text Similarity", "Compare two texts with bag-of-words cosine similarity.", "ai-ml", ["similarity"]),
  t("chunk-size-calculator", "Chunk Size Calculator", "Estimate chunk counts for RAG ingestion.", "ai-ml", ["chunk", "rag"]),
  t("rag-visualizer", "RAG Visualizer", "Walk through ingest → retrieve → generate stages.", "ai-ml", ["rag"]),
  t("confusion-matrix", "Confusion Matrix", "Enter TP/FP/TN/FN and view derived metrics.", "ai-ml", ["confusion"]),
  t("precision-calculator", "Precision Calculator", "Calculate precision from true and false positives.", "ai-ml", ["precision"]),
  t("recall-calculator", "Recall Calculator", "Calculate recall from true positives and false negatives.", "ai-ml", ["recall"]),
  t("f1-calculator", "F1 Calculator", "Calculate F1 from precision and recall inputs.", "ai-ml", ["f1"]),
  t("roc-visualizer", "ROC Visualizer", "Plot a simple ROC curve from TPR/FPR points.", "ai-ml", ["roc"]),
  t("train-test-split", "Train/Test Split", "Split line-based datasets into train and test sets.", "ai-ml", ["split"]),
  t("neural-network-visualizer", "Neural Network Visualizer", "Visualize a simple feed-forward layer layout.", "ai-ml", ["neural"]),
  t("temperature-explorer", "Temperature Explorer", "Explore how temperature reshapes token probabilities.", "ai-ml", ["temperature"]),
  t("ml-metrics", "ML Metrics", "Compute accuracy, precision, recall and F1 together.", "ai-ml", ["metrics"]),
  t("agent-workflow-designer", "Agent Workflow Designer", "Draft a multi-agent workflow as ordered steps.", "ai-ml", ["agents"]),
  t("vector-search-explorer", "Vector Search Explorer", "Rank documents against a query with cosine similarity.", "ai-ml", ["vector"]),

  // Image / PDF
  t("image-compressor", "Image Compressor", "Compress images in the browser with quality control.", "image-pdf", ["compress"]),
  t("image-resizer", "Image Resizer", "Resize images to target dimensions.", "image-pdf", ["resize"]),
  t("image-format-converter", "Image Format Converter", "Convert images between PNG, JPEG and WebP.", "image-pdf", ["convert"]),
  t("image-to-base64", "Image to Base64", "Convert an image file to a Base64 data URL.", "image-pdf", ["base64"]),
  t("pdf-merger", "PDF Merger", "Merge multiple PDF files in the browser.", "image-pdf", ["pdf", "merge"]),
  t("pdf-splitter", "PDF Splitter", "Extract a page range from a PDF.", "image-pdf", ["pdf", "split"]),
  t("pdf-page-counter", "PDF Page Counter", "Count pages in an uploaded PDF.", "image-pdf", ["pdf"]),
  t("pdf-metadata-viewer", "PDF Metadata Viewer", "Inspect basic PDF metadata locally.", "image-pdf", ["pdf", "metadata"]),
  t("qr-code-reader", "QR Code Reader", "Decode QR codes from uploaded images.", "image-pdf", ["qr"]),
  t("file-size-converter", "File Size Converter", "Convert between B, KB, MB and GB.", "image-pdf", ["size"]),
  t("exif-viewer", "EXIF Viewer", "Show basic image file metadata available in-browser.", "image-pdf", ["exif"]),
  t("exif-remover", "EXIF Remover", "Re-encode an image via canvas to strip EXIF metadata.", "image-pdf", ["exif"]),

  // Student
  t("scientific-calculator", "Scientific Calculator", "Evaluate common scientific expressions.", "student", ["calculator"]),
  t("matrix-calculator", "Matrix Calculator", "Add or multiply small matrices.", "student", ["matrix"]),
  t("equation-solver", "Equation Solver", "Solve linear equations of the form ax + b = c.", "student", ["equation"]),
  t("percentage-calculator", "Percentage Calculator", "Calculate percentages, increases and decreases.", "student", ["percent"]),
  t("gpa-calculator", "GPA Calculator", "Compute GPA from credit-weighted grades.", "student", ["gpa"]),
  t("statistics-calculator", "Statistics Calculator", "Basic stats for a list of numbers.", "student", ["statistics"]),
  t("probability-calculator", "Probability Calculator", "Combinations, permutations and simple probability.", "student", ["probability"]),
  t("binary-calculator", "Binary Calculator", "Add or convert binary numbers.", "student", ["binary"]),
  t("number-system-converter", "Number System Converter", "Convert between binary, octal, decimal and hex.", "student", ["hex"]),
  t("unit-converter", "Unit Converter", "Convert length, weight and temperature units.", "student", ["units"]),
  t("bmi-calculator", "BMI Calculator", "Calculate body mass index from height and weight.", "student", ["bmi"]),
  t("loan-calculator", "Loan Calculator", "Estimate EMI for a fixed loan.", "student", ["loan", "emi"]),
  t("graph-plotter", "Graph Plotter", "Plot y values for a simple expression over x.", "student", ["graph"]),
  t("derivative-calculator", "Derivative Calculator", "Numeric derivative approximation at a point.", "student", ["derivative"]),
  t("integral-calculator", "Integral Calculator", "Numeric integral approximation over an interval.", "student", ["integral"]),

  // Sri Lanka
  t("salary-calculator", "Salary Calculator", "Estimate gross-to-net with EPF assumptions.", "sri-lanka", ["salary"], [
    { question: "Are these official?", answer: "No. Illustrative assumptions dated 2026-11 for planning only." },
  ]),
  t("epf-calculator", "EPF Calculator", "Calculate employee and employer EPF contributions.", "sri-lanka", ["epf"]),
  t("etf-calculator", "ETF Calculator", "Calculate employer ETF contribution.", "sri-lanka", ["etf"]),
  t("take-home-salary-calculator", "Take-home Salary Calculator", "Estimate take-home after EPF and deductions.", "sri-lanka", ["take-home"]),
  t("currency-converter", "Currency Converter", "Convert amounts with a manual exchange rate.", "sri-lanka", ["currency", "lkr"]),
  t("electricity-bill-estimator", "Electricity Bill Estimator", "Estimate a simplified domestic electricity bill.", "sri-lanka", ["electricity"]),
  t("budget-planner", "Budget Planner", "Plan income vs expenses and remaining balance.", "sri-lanka", ["budget"]),
  t("savings-calculator", "Savings Calculator", "Project savings growth with monthly contributions.", "sri-lanka", ["savings"]),
  t("fuel-cost-calculator", "Fuel Cost Calculator", "Estimate trip fuel cost from distance and efficiency.", "sri-lanka", ["fuel"]),
  t("vat-calculator", "VAT Calculator", "Add or remove VAT at a configurable rate.", "sri-lanka", ["vat"]),
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
    const haystack = [tool.title, tool.description, tool.category, ...tool.keywords]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
