import type {
  CaseStudy,
  Certification,
  Education,
  Experience,
  ProfileContent,
  Project,
  Skill,
} from "@/types/portfolio";

/**
 * Static portfolio content used until Supabase-backed admin editing is live.
 * Keep claims conservative. Do not invent employment history, metrics, or awards.
 */
export const profileContent: ProfileContent = {
  name: "Oshaka Dilhara",
  headline: "Building Intelligent Solutions for a Better Digital Future.",
  shortBio:
    "I explore artificial intelligence, software engineering, data systems and emerging technologies. I enjoy transforming complex ideas into practical applications and useful digital experiences.",
  longBio: [
    "This platform is a living technology ecosystem — portfolio, publication, free tools, AI labs and learning resources — built to help people explore, learn and build.",
    "My work spans intelligent systems, practical software delivery and data-informed products. Content here will continue to grow as projects, writing and tools mature.",
    "Professional details such as employment history, certifications and education are managed through the administrator dashboard and should only reflect verified information.",
  ],
  focusAreas: [
    "Artificial intelligence and agentic systems",
    "Software engineering with modern web platforms",
    "Data engineering and analytics experiences",
    "Developer tools and learning resources",
  ],
  availabilityNote:
    "Open to thoughtful collaborations, technical conversations and CloudCey inquiries.",
};

export const skills: Skill[] = [
  { id: "python", name: "Python", category: "software-engineering" },
  { id: "typescript", name: "TypeScript", category: "software-engineering" },
  { id: "javascript", name: "JavaScript", category: "software-engineering" },
  { id: "react", name: "React", category: "software-engineering" },
  { id: "nextjs", name: "Next.js", category: "software-engineering" },
  { id: "sql", name: "SQL", category: "data" },
  { id: "postgresql", name: "PostgreSQL", category: "data" },
  { id: "ml", name: "Machine Learning", category: "artificial-intelligence" },
  { id: "genai", name: "Generative AI", category: "artificial-intelligence" },
  { id: "rag", name: "RAG Systems", category: "artificial-intelligence" },
  { id: "agents", name: "AI Agents", category: "artificial-intelligence" },
  { id: "data-eng", name: "Data Engineering", category: "data" },
  { id: "powerbi", name: "Power BI", category: "data" },
  { id: "supabase", name: "Supabase", category: "cloud" },
  { id: "vercel", name: "Vercel", category: "cloud" },
  { id: "aws", name: "AWS", category: "cloud" },
  { id: "docker", name: "Docker", category: "tools" },
  { id: "git", name: "Git", category: "tools" },
];

export const projects: Project[] = [
  {
    id: "ai-boardroom-copilot",
    slug: "ai-boardroom-copilot",
    title: "AI Boardroom Copilot",
    summary:
      "Decision-support concept for structured boardroom discussions with evidence-aware assistance.",
    description:
      "Explores how multi-agent workflows can help surface evidence, alternatives and decision impacts during strategic conversations — without replacing human judgment.",
    status: "in-progress",
    stack: ["Python", "LLMs", "RAG", "Agents"],
    featured: true,
  },
  {
    id: "auto-insight-bi",
    slug: "auto-insight-bi",
    title: "Auto-Insight BI",
    summary:
      "Analytics experience focused on turning raw business data into clearer narrative insights.",
    description:
      "Combines data profiling, visualization patterns and AI-assisted summarization to help teams understand what is changing and why it may matter.",
    status: "in-progress",
    stack: ["Power BI", "Python", "SQL", "Generative AI"],
    featured: true,
  },
  {
    id: "gem-classification-system",
    slug: "gem-classification-system",
    title: "Gem Classification System",
    summary:
      "Computer-vision oriented system concept for gemstone classification workflows.",
    description:
      "Investigates image-based classification pipelines, labeling practices and evaluation approaches for gem-related visual categories.",
    status: "concept",
    stack: ["Python", "Computer Vision", "ML"],
    featured: true,
  },
  {
    id: "sfr-tracking-pipeline",
    slug: "sfr-tracking-pipeline",
    title: "SFR Tracking Pipeline",
    summary:
      "Data pipeline concept for tracking structured operational records with clearer lineage.",
    description:
      "Focuses on reliable ingestion, transformation and reporting patterns for operational tracking use cases.",
    status: "in-progress",
    stack: ["SQL", "ETL", "Data Engineering"],
    featured: false,
  },
  {
    id: "goviya",
    slug: "goviya",
    title: "Goviya",
    summary:
      "Agriculture-oriented digital product concept connecting practical tools with local context.",
    description:
      "Explores useful digital experiences for agricultural workflows, information access and decision support.",
    status: "concept",
    stack: ["Next.js", "Mobile-first UX", "Data"],
    featured: false,
  },
  {
    id: "carryshare",
    slug: "carryshare",
    title: "CarryShare",
    summary:
      "Sharing-economy product concept for coordinated carry and delivery style workflows.",
    description:
      "Product exploration around trust, matching and operational clarity for shared carrying experiences.",
    status: "concept",
    stack: ["React", "Maps", "Product Design"],
    featured: false,
  },
  {
    id: "cloudcey",
    slug: "cloudcey",
    title: "CloudCey",
    summary:
      "Service brand for AI automation, analytics and custom software delivery.",
    description:
      "CloudCey packages consulting and build offerings across AI automation, business intelligence, chatbots, RAG applications and data engineering.",
    status: "maintained",
    stack: ["AI", "BI", "Software Engineering", "Consulting"],
    featured: true,
    cloudcey: true,
    href: "/cloudcey",
  },
];

/** Empty until verified entries are added through admin. */
export const experiences: Experience[] = [];

/** Empty until verified entries are added through admin. */
export const education: Education[] = [];

/** Empty until verified entries are added through admin. */
export const certifications: Certification[] = [];

export const caseStudies: CaseStudy[] = [
  {
    id: "evidence-aware-decisions",
    slug: "evidence-aware-decision-support",
    title: "Evidence-aware decision support",
    summary:
      "How structured evidence and impact framing can improve multi-agent decision assistance.",
    problem:
      "Business decisions often mix incomplete evidence, competing interpretations and unclear downstream impact.",
    approach:
      "Separate evidence collection, adjudication and impact framing into explicit stages that remain inspectable by humans.",
    outcome:
      "A research-oriented design direction that prioritizes explainability over opaque automation. Results remain exploratory until validated in production settings.",
    relatedProjectSlug: "ai-boardroom-copilot",
  },
];

export const skillCategoryLabels: Record<string, string> = {
  "artificial-intelligence": "Artificial Intelligence",
  "software-engineering": "Software Engineering",
  data: "Data",
  cloud: "Cloud & Platforms",
  tools: "Tools",
};
