export const siteConfig = {
  name: "Oshaka Dilhara",
  brand: "OSHAKA DILHARA",
  domain: "oshakadilhara.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://oshakadilhara.com",
  tagline: "Technology. Intelligence. Innovation.",
  philosophy: "Explore. Learn. Build.",
  headline: "Building Intelligent Solutions for a Better Digital Future.",
  description:
    "I explore artificial intelligence, software engineering, data systems and emerging technologies. I enjoy transforming complex ideas into practical applications and useful digital experiences.",
  email: "hello@oshakadilhara.com",
  links: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
  },
} as const;

export const mainNav = [
  { title: "About", href: "/about" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Blog", href: "/blog" },
  { title: "Tools", href: "/tools" },
  { title: "Labs", href: "/labs" },
  { title: "Learning", href: "/learning" },
  { title: "CloudCey", href: "/cloudcey" },
  { title: "Contact", href: "/contact" },
] as const;

export const moreNav = [
  { title: "Architecture", href: "/architecture" },
  { title: "Research", href: "/research" },
  { title: "Resources", href: "/resources" },
  { title: "Open Source", href: "/opensource" },
  { title: "Career", href: "/career" },
  { title: "Insights", href: "/insights" },
] as const;

export const footerNav = {
  explore: [
    { title: "Portfolio", href: "/portfolio" },
    { title: "Blog", href: "/blog" },
    { title: "Free Tools", href: "/tools" },
    { title: "AI Labs", href: "/labs" },
  ],
  learn: [
    { title: "Learning Hub", href: "/learning" },
    { title: "Architecture", href: "/architecture" },
    { title: "Research", href: "/research" },
    { title: "Resources", href: "/resources" },
  ],
  company: [
    { title: "About", href: "/about" },
    { title: "CloudCey", href: "/cloudcey" },
    { title: "Career Hub", href: "/career" },
    { title: "Contact", href: "/contact" },
  ],
  legal: [
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
  ],
} as const;
