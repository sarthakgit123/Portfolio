import { GraduationCap, Terminal } from "lucide-react";
import type { Achievement, Leadership } from "@/types";

export const achievements: Achievement[] = [
  {
    title: "Amazon Machine Learning Summer School 2026",
    detail:
      "Selected for a competitive program covering Machine Learning, Deep Learning, Generative AI, Large Language Models and Responsible AI.",
    icon: GraduationCap,
  },
  {
    title: "200+ DSA problems solved",
    detail:
      "Data Structures & Algorithms practice across LeetCode and TakeUForward.",
    icon: Terminal,
  },
];

/**
 * Listed as a progression rather than as two current titles. Both cells were
 * joined at the bottom and climbed over two years, which is the part worth
 * showing — a single "Head" line hides it.
 */
export const leadership: Leadership[] = [
  {
    organisation: "Training & Placement Cell, NIT Delhi",
    role: "Database Head",
    period: "Jan 2026 — Present",
  },
  {
    organisation: "Training & Placement Cell, NIT Delhi",
    role: "Executive Member, then Volunteer",
    period: "Jan 2024 — Dec 2025",
  },
  {
    organisation: "Unnat Bharat Abhiyan (UBA) Cell, NIT Delhi",
    role: "Deputy General Secretary",
    period: "June 2025 — Feb 2026",
  },
  {
    organisation: "Unnat Bharat Abhiyan (UBA) Cell, NIT Delhi",
    role: "Executive Member",
    period: "June 2024 — June 2025",
  },
];
