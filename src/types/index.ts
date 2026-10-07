import type { LucideIcon } from "lucide-react";

export interface SocialLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  /** Oversized watermark numeral used behind the entry. */
  year: string;
  summary: string;
  highlights: string[];
  stack: string[];
  repo?: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  /** One or two lines. Deliberately not an explanation. */
  description: string;
  /** The single thing this project taught — the progression marker. */
  learning: string;
  /** Headline numbers. Only figures that exist in the repo or resume. */
  metrics: { value: string; label: string }[];
  stack: string[];
  repo?: string;
  demo?: string;
  /**
   * The actual stages data moves through, in order — the spine of the system
   * rather than a feature list. This is the thing that makes the section read
   * as engineering instead of as a gallery, and every stage here corresponds
   * to a real module in the repository.
   */
  flow: string[];
  /** Discipline label shown on the meta rail, e.g. "AI Systems". */
  kind: string;
  /** Year the work was done, for the meta rail. */
  year: string;
  /** The lead project gets a wider, stacked treatment. At most one. */
  featured?: boolean;
}

export interface SkillGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  skills: string[];
}

export interface Achievement {
  title: string;
  detail: string;
  icon: LucideIcon;
}

export interface Leadership {
  organisation: string;
  role: string;
  period: string;
}

export interface Education {
  institution: string;
  qualification: string;
  period: string;
  location: string;
  /** Result as the candidate reports it — CGPA, percentage, etc. */
  score?: string;
}

export type SectionId =
  | "home"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "contact";

export interface NavItem {
  id: SectionId;
  label: string;
}
