import type { Project } from "@/types";

/**
 * Ordered by weight, not chronology: RecruitAI leads because it is the fullest
 * system here — parsing, retrieval, ranking and a chat surface over one
 * pipeline — and everything after it shows a different axis of the same work.
 *
 * Every figure below is traceable to the repository or the resume. `flow` is
 * not decoration: each stage names a real module in the codebase.
 */
export const projects: Project[] = [
  {
    id: "recruitai",
    name: "RecruitAI",
    tagline: "AI resume intelligence",
    kind: "AI Systems",
    year: "2026",
    featured: true,
    description:
      "Upload a zip of resumes and get structured profiles, explainable rankings against a job description, and a RAG chatbot that answers questions across the whole candidate pool.",
    learning:
      "That the interesting part of an LLM system is everything around the LLM — verification, retrieval, and being able to explain the score.",
    metrics: [
      { value: "5", label: "ranking factors" },
      { value: "384", label: "embedding dims" },
      { value: "80+", label: "skill synonyms" },
    ],
    flow: [
      "Resume zip",
      "LLM parse",
      "Verify dates",
      "FAISS index",
      "Hybrid rank",
      "Explain",
    ],
    stack: [
      "FastAPI",
      "OpenRouter",
      "FAISS",
      "Sentence-Transformers",
      "PyMuPDF",
      "PostgreSQL",
    ],
    repo: "https://github.com/sarthakgit123/RecruitAI",
  },
  {
    id: "battery-state-estimation",
    name: "Battery State Estimation",
    tagline: "SoC · SoH · RUL",
    kind: "Applied ML",
    year: "2025",
    description:
      "An Extended Kalman Filter in Simulink benchmarked against Python ML regressors, across all three BMS pillars. Grew out of the DRDO internship.",
    learning: "Where model-based estimation still beats data-driven.",
    metrics: [
      { value: "50,000+", label: "time-series records" },
      { value: "18%", label: "lower SoC error" },
    ],
    flow: [
      "NASA cycles",
      "Clean + features",
      "EKF model",
      "ML regressors",
      "RMSE / MAE / R2",
    ],
    stack: ["Python", "Scikit-learn", "Simulink", "EKF", "Pandas"],
    repo: "https://github.com/sarthakgit123/Battery-State-Estimation-SoC-SoH-RUL",
  },
  {
    id: "smart-expense-manager",
    name: "Smart Expense Manager",
    tagline: "Django backend",
    kind: "Backend",
    year: "2026",
    description:
      "Multi-user finance tracking with a rule-based budgeting engine, email alerts on threshold breaches, and a category-wise analytics dashboard.",
    learning: "Owning a backend end to end, deployment included.",
    metrics: [
      { value: "60%", label: "less manual tracking" },
      { value: "Live", label: "in production" },
    ],
    flow: [
      "OAuth 2.0",
      "Transactions",
      "Categorise",
      "Budget rules",
      "SMTP alerts",
      "Dashboard",
    ],
    stack: ["Django", "DRF", "PostgreSQL", "OAuth 2.0", "REST"],
    repo: "https://github.com/sarthakgit123/Smart-Expense-Manager",
    demo: "https://smart-expense-manager-lemon.vercel.app/",
  },
  {
    id: "nexavir-case-study",
    name: "Commercial Analytics — Nexavir",
    tagline: "Business analytics",
    kind: "Analytics",
    year: "2026",
    description:
      "Eighteen months of clinical alert and prescription data, read for where demand stops converting.",
    learning: "Turning diagnostics into a decision someone can act on.",
    metrics: [
      { value: "9,537", label: "clinical alerts" },
      { value: "41.6%", label: "conversion" },
    ],
    flow: ["Alerts", "Positive dx", "Prescribed", "Conversion gap"],
    stack: ["Python", "Pandas", "Jupyter", "EDA"],
    repo: "https://github.com/sarthakgit123/Commercial-Analytics-Case-Study-Nexavir",
  },
  {
    id: "ice-cream-shop",
    name: "The Ice Cream Shop",
    tagline: "Multi-role commerce",
    kind: "Full-stack",
    year: "2025",
    description:
      "A Django storefront with three separate roles — customers browse and order, vendors manage inventory from their own dashboard, admins oversee both.",
    learning: "Modelling permissions before writing a single view.",
    metrics: [
      { value: "3", label: "user roles" },
      { value: "2", label: "dashboards" },
    ],
    flow: ["Catalog", "Cart", "Checkout", "Vendor fulfilment"],
    stack: ["Django", "SQLite", "JavaScript", "Django Auth"],
    repo: "https://github.com/sarthakgit123/The-Ice-Cream-Shop",
  },
];
