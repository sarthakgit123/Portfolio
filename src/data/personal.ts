import { Github, Linkedin, Code2, Mail } from "lucide-react";
import type { NavItem, SocialLink } from "@/types";

export const personal = {
  name: "Sarthak Kumar Seth",
  role: "AI / Backend Engineer",
  /**
   * The old line ("Build intelligent systems, AI-powered applications, and
   * scalable software") described a job category, not a person — it would fit
   * any of ten thousand portfolios. This one names the actual route in:
   * electrical engineering first, software second, which is both true and the
   * thing that makes the work read differently.
   */
  tagline:
    "Electrical engineering taught me to model a system. Software let me ship one.",
  email: "sarthakkseth@gmail.com",
  phone: "+91 9015558103",
  location: "New Delhi, India",
  resume: "/Sarthak_Resume.pdf",
  /**
   * Short professional introduction — hero.
   */
  intro:
    "Final-year Electrical Engineering at NIT Delhi, selected for Amazon ML Summer School 2026, previously a summer trainee at DRDO. I build LLM pipelines, retrieval systems, and the APIs that carry them to production.",
} as const;

/**
 * Contact copy. A voice line rather than a credential — the section head asks
 * a question, and this answers what it is actually an invitation to.
 */
export const contact = {
  lead: "Based in New Delhi. Happiest talking about ML systems, backends, or anything battery-adjacent.",
} as const;

export const socials: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/sarthakgit123",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sarthak-kumar-seth-aa1280277/",
    icon: Linkedin,
  },
  {
    label: "LeetCode",
    href: "https://leetcode.com/u/231230055/",
    icon: Code2,
  },
  {
    label: "Email",
    href: "mailto:sarthakkseth@gmail.com",
    icon: Mail,
  },
];

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

/**
 * About copy — a single statement. The section carries its weight visually
 * through the portrait, the education timeline and the pipeline diagram, so
 * the words only need to land the positioning.
 */
export const about = {
  /**
   * One line, and a disposition rather than a biography — the hero already
   * carries the electrical-engineering-to-software arc, so repeating it here
   * wasted the largest type on the page. Four sentences of it, previously.
   */
  lead: "I don't trust a model until I've tried to break it.",

  /**
   * Three working principles, each with the specific piece of work that earns
   * it. The evidence line is the whole point: without it these are the same
   * platitudes every portfolio prints, and with it they are a claim anyone can
   * go and check in the repository.
   */
  principles: [
    {
      statement: "Verify, don't assume.",
      evidence:
        "RecruitAI recomputes every candidate's experience from start and end dates in Python, rather than trusting the figure the model returned.",
    },
    {
      statement: "Benchmark before believing.",
      evidence:
        "The battery work ran an Extended Kalman Filter against ML regressors on the same cells before concluding anything about either.",
    },
    {
      statement: "Finish it in production.",
      evidence:
        "The expense manager is deployed and running on real accounts, with budget rules and email alerts — not a demo video.",
    },
  ],
} as const;
