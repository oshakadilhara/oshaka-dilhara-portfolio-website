import {
  caseStudies,
  certifications,
  education,
  experiences,
  profileContent,
  projects,
  skills,
} from "@/features/portfolio/data/content";

export function getProfile() {
  return profileContent;
}

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured);
}

export function getAllProjects() {
  return projects;
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug) ?? null;
}

export function getSkills() {
  return skills;
}

export function getExperiences() {
  return experiences;
}

export function getEducation() {
  return education;
}

export function getCertifications() {
  return certifications;
}

export function getCaseStudies() {
  return caseStudies;
}

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((study) => study.slug === slug) ?? null;
}
