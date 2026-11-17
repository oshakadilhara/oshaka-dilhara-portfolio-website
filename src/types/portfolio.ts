export type SkillCategory =
  | "artificial-intelligence"
  | "software-engineering"
  | "data"
  | "cloud"
  | "tools";

export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
};

export type ProjectStatus = "concept" | "in-progress" | "completed" | "maintained";

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  stack: string[];
  featured: boolean;
  href?: string;
  cloudcey?: boolean;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  startLabel: string;
  endLabel: string;
  summary: string;
  highlights: string[];
};

export type Education = {
  id: string;
  institution: string;
  credential: string;
  field?: string;
  startLabel?: string;
  endLabel?: string;
  summary?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  issuedLabel?: string;
  credentialId?: string;
  url?: string;
};

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  relatedProjectSlug?: string;
};

export type ProfileContent = {
  name: string;
  headline: string;
  shortBio: string;
  longBio: string[];
  focusAreas: string[];
  availabilityNote: string;
};
