import type { Candidate } from "@/lib/types";

/**
 * Small bundled dataset so a recruiter can explore the product instantly
 * without preparing their own candidate file. Shape matches
 * src/models/candidate_models.py::Candidate exactly.
 */
export const DEMO_CANDIDATES: Candidate[] = [
  {
    candidate_id: "CAND_DEMO_001",
    name: "Ira Vora",
    title: "Backend Engineer",
    skills: ["Python", "SQL", "Spark", "Airflow", "AWS"],
    experience_years: 7,
    past_roles: ["Backend Engineer", "Analytics Engineer"],
    role_progression: ["Analytics Engineer", "Backend Engineer"],
    github_activity_score: 62,
    certifications: ["AWS Certified Data Analytics"],
    hackathons: 1,
    learning_consistency_score: 71,
    bio: "Data/backend hybrid engineer transitioning toward ML-focused work, with self-directed Kaggle and fine-tuning projects alongside a data-engineering core.",
  },
  {
    candidate_id: "CAND_DEMO_002",
    name: "Rahul Sinha",
    title: "Machine Learning Engineer",
    skills: ["Python", "PyTorch", "LLM", "FastAPI", "LangChain"],
    experience_years: 4,
    past_roles: ["ML Engineer", "Data Scientist"],
    role_progression: ["Data Scientist", "ML Engineer"],
    github_activity_score: 84,
    certifications: ["DeepLearning.AI NLP Specialization"],
    hackathons: 3,
    learning_consistency_score: 88,
    bio: "Built and shipped two production LLM features, active open-source contributor, consistent hackathon participant with a strong applied-research bent.",
  },
  {
    candidate_id: "CAND_DEMO_003",
    name: "Meera Chandrasekaran",
    title: "Staff Software Engineer",
    skills: ["Go", "Kubernetes", "Distributed Systems", "AWS", "Python"],
    experience_years: 11,
    past_roles: [
      "Software Engineer",
      "Senior Software Engineer",
      "Staff Software Engineer",
    ],
    role_progression: [
      "Software Engineer",
      "Senior Software Engineer",
      "Staff Software Engineer",
    ],
    github_activity_score: 55,
    certifications: [],
    hackathons: 0,
    learning_consistency_score: 60,
    bio: "Deep infrastructure background leading platform reliability for a Series-D startup; limited direct ML exposure but strong systems fundamentals.",
  },
  {
    candidate_id: "CAND_DEMO_004",
    name: "Devika Nair",
    title: "AI Product Engineer",
    skills: ["Python", "TypeScript", "LLM", "React", "FastAPI", "AWS"],
    experience_years: 3,
    past_roles: ["Full-Stack Engineer", "AI Product Engineer"],
    role_progression: ["Full-Stack Engineer", "AI Product Engineer"],
    github_activity_score: 91,
    certifications: ["AWS Certified Solutions Architect"],
    hackathons: 5,
    learning_consistency_score: 94,
    bio: "Fast-growing full-stack-turned-AI engineer with heavy hackathon presence and a track record of shipping end-to-end LLM products solo.",
  },
  {
    candidate_id: "CAND_DEMO_005",
    name: "Arjun Malhotra",
    title: "Senior Data Engineer",
    skills: ["Python", "SQL", "Spark", "Kafka", "dbt"],
    experience_years: 8,
    past_roles: ["Data Engineer", "Senior Data Engineer"],
    role_progression: ["Data Engineer", "Senior Data Engineer"],
    github_activity_score: 40,
    certifications: [],
    hackathons: 0,
    learning_consistency_score: 48,
    bio: "Solid pipeline and warehousing background; primarily maintenance-oriented work with limited exposure to modern ML tooling.",
  },
  {
    candidate_id: "CAND_DEMO_006",
    name: "Priya Raghavan",
    title: "Machine Learning Researcher",
    skills: ["Python", "PyTorch", "Research", "LLM", "CUDA"],
    experience_years: 5,
    past_roles: ["Research Engineer", "ML Researcher"],
    role_progression: ["Research Engineer", "ML Researcher"],
    github_activity_score: 76,
    certifications: ["Stanford CS224N"],
    hackathons: 2,
    learning_consistency_score: 82,
    bio: "Published research on efficient fine-tuning methods; strong theoretical depth, still building production/deployment experience.",
  },
];

export const DEMO_JD_TEXT = `We're hiring a Machine Learning Engineer to join our founding AI team.

You'll own the full lifecycle of our LLM-powered features — from prototyping with FastAPI services to productionizing retrieval and fine-tuning pipelines.

Requirements:
- 3+ years of experience in Python
- Hands-on experience with LLMs and prompt/RAG pipelines
- Experience with FastAPI or similar backend frameworks
- Comfortable with ambiguity in a fast-moving startup environment

Nice to have:
- Experience with AWS
- Familiarity with LangChain or similar orchestration frameworks
- Open-source contributions

You will work directly with the founding team, own decisions end-to-end, and move fast without much process. We value ownership mindset and a bias toward shipping.`;
