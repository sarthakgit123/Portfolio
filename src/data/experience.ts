import type { Experience } from "@/types";

/** One line each, two highlights maximum. The timeline is a scan, not a read. */
export const experiences: Experience[] = [
  {
    id: "itomata",
    role: "Software Developer Intern",
    company: "Itomata LLP",
    period: "June 2026 — July 2026",
    year: "2026",
    summary:
      "Built an AI Tutor pipeline that transformed educational content into personalized learning resources using LLMs and automated workflows.",
    highlights: [
      "Developed AI workflows for summaries, quizzes, mind maps, knowledge graphs, and recommendations.",
      "Integrated Gemini, OpenRouter, OCR, PyMuPDF, Flask, and n8n.",
    ],
    stack: ["Python", "Flask", "Gemini", "OpenRouter", "n8n", "OCR"],
  },
  {
    id: "deal-drdo",
    role: "Summer Trainee",
    company: "DRDO, Ministry of Defence",
    location: "Dehradun",
    period: "June 2025 — August 2025",
    year: "2025",
    summary:
      "Two workstreams across two groups: SoC estimation with the AI group, and EMI/EMC chamber design with the EMI/EMC group.",
    highlights: [
      "Processed 50,000+ battery time-series records and benchmarked EKF against ML regressors, reaching up to 18% lower SoC estimation error.",
      "Contributed to design considerations for a semi-anechoic EMI/EMC test chamber.",
    ],
    stack: [
      "Python",
      "MATLAB",
      "Machine Learning",
      "XGBoost",
      "Pandas",
      "EMI/EMC",
    ],
    repo: "https://github.com/sarthakgit123/Battery-State-Estimation-SoC-SoH-RUL",
  },
];
