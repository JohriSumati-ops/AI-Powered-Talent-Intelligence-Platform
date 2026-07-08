# Talent Intelligence Engine
## AI-Powered Candidate Ranking Beyond Keyword Matching

> Hiring is broken. We built intelligence for it.

Recruiters review hundreds of profiles and still miss exceptional candidates—not because talent isn’t there, but because traditional Applicant Tracking Systems (ATS) rely heavily on keyword matching.

A great recruiter doesn’t evaluate candidates by keywords alone.

They assess:
- Skills
- Experience
- Career growth
- Behavioral signals
- Hidden potential

Talent Intelligence Engine replicates this recruiter intelligence using AI.

---

# Problem Statement

Traditional hiring systems fail because they:

- Over-prioritize keyword matching  
- Ignore career trajectory  
- Miss behavioral indicators  
- Fail to identify high-potential candidates  

As a result:

- Strong candidates are filtered out  
- Recruiters spend more time manually screening  
- Shortlist quality decreases  

We built Talent Intelligence Engine to solve this.

---

# Solution Overview

Talent Intelligence Engine evaluates candidates the way an experienced recruiter would.

Instead of asking:

> Does this resume contain the right keywords?

It asks:

- Is this candidate genuinely qualified?
- Does their experience align with the role?
- Is their career growth strong?
- Do they show behavioral signals of long-term success?
- What hidden strengths or risks should recruiters know?

---

# Core Capabilities

## 1) Intelligent Job Description Parsing

The system understands hiring requirements from raw job descriptions.

Extracts:
- Role
- Required Skills
- Preferred Skills
- Experience Threshold
- Behavioral Expectations

### Example Output

```json
{
  "role": "Machine Learning Engineer",
  "required_skills": ["Python", "LLM", "FastAPI"],
  "preferred_skills": ["AWS", "LangChain"],
  "min_experience": 3,
  "behavior_traits": ["ownership mindset"]
}
```

---

## 2) Multi-Dimensional Candidate Ranking

Each candidate is scored across 5 major dimensions.

### Skill Match
How well candidate skills align with job requirements.

### Experience Relevance
Relevance of past roles and years of experience.

### Career Trajectory
Career progression and growth pattern.

### Behavioral Signals
Certifications, GitHub activity, hackathons, learning consistency.

### Hidden Potential
Identifies strong non-obvious candidates.

---

# Hybrid Scoring Engine

Final ranking combines multiple dimensions.

```text
Final Score =
Weighted Skill Score +
Experience Score +
Trajectory Score +
Behavior Score +
Potential Score
```

This creates rankings closer to human recruiter reasoning.

---

## 3) Explainable AI Recommendations

Every candidate includes:

- Final Score  
- Strengths  
- Risks  
- Recommendation  
- Full AI Explanation  

### Example

```json
{
  "recommendation": "Strong Hire",
  "standout_strengths": [
    "Excellent skill alignment",
    "Strong learning consistency"
  ],
  "key_risks": [
    "Limited leadership exposure"
  ]
}
```

---

## 4) Semantic Candidate Retrieval (FAISS)

Built with vector search for intelligent candidate discovery.

Example queries:
- Strong backend engineers with AI exposure
- Candidates with leadership potential
- Top profiles with strong future growth

Enables:
- Faster discovery  
- Better shortlists  
- Semantic search beyond keywords  

---

## 5) AI Recruiter Assistant

Interactive recruiter intelligence layer.

Examples:
- Why is Candidate A ranked higher?
- Who has strongest future potential?
- Compare top candidates
- Explain ranking decisions

---

## 6) Candidate Comparison Engine

Compare candidates head-to-head across:
- Skill Match  
- Experience  
- Potential  
- Recommendation  

Supports faster final hiring decisions.

---

## Product Walkthrough

### Dashboard

<img width="1917" height="905" alt="landing_page" src="https://github.com/user-attachments/assets/79ecfc69-1058-436d-a2fc-b492689ef3f3" />


### JD Parsing

<img width="1897" height="895" alt="job_parser" src="https://github.com/user-attachments/assets/9b9aadb5-f1e8-48bf-91a0-0ce1113272c2" />


### Candidate Ranking

<img width="1917" height="926" alt="ranking_page" src="https://github.com/user-attachments/assets/858723bb-3de3-48fd-aa2a-6d181bea4c7d" />


### Candidate Comparison

<img width="1917" height="906" alt="comapre" src="https://github.com/user-attachments/assets/d9616562-3beb-4907-8c87-712897e98e15" />


### Recruiter Copilot

<img width="1912" height="917" alt="chatbot" src="https://github.com/user-attachments/assets/fbf49200-f0f8-41c9-ac6e-3abe322e27cb" />


### Explainable AI

<img width="1917" height="911" alt="reasoning" src="https://github.com/user-attachments/assets/f9ccd7c5-aa67-471a-8930-b402b4a90aa3" />


# System Architecture

```text
                ┌────────────────────┐
                │ Job Description     │
                └──────────┬─────────┘
                           │
                           ▼
                 ┌──────────────────┐
                 │ JD Parser Engine │
                 └──────────┬───────┘
                            │
                            ▼
        ┌─────────────────────────────────────┐
        │ Candidate Intelligence Engine       │
        │ - Skill Analysis                    │
        │ - Experience Scoring                │
        │ - Behavioral Evaluation             │
        │ - Potential Detection               │
        └───────────────┬─────────────────────┘
                        │
                        ▼
             ┌────────────────────┐
             │ Ranking Engine      │
             └──────────┬─────────┘
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
 ┌────────────┐ ┌─────────────┐ ┌─────────────┐
 │ Retrieval  │ │ AI Chat     │ │ Comparison  │
 └────────────┘ └─────────────┘ └─────────────┘
```

---

# Tech Stack

## Backend
- Python
- FastAPI
- Pydantic

## AI / ML
- LLM-based reasoning
- Hybrid ranking models
- Semantic retrieval
- FAISS

## Frontend
- React
- TypeScript

---

# Project Structure

```bash
talent-intelligence-engine/
│
├── src/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── utils/
│
├── competition/
├── data/
├── screenshots/
├── requirements.txt
├── main.py
└── README.md
```

---

# API Endpoints

### Job Description Parsing
```http
POST /jd/parse-jd
```

### Candidate Ranking
```http
POST /ranking/rank
```

### Semantic Retrieval
```http
POST /retrieval/retrieve
```

### Recruiter Chat
```http
POST /chat/chat
```

### Candidate Comparison
```http
POST /compare/compare
```

---

# Key Results

Talent Intelligence Engine successfully:

✅ Parses job descriptions intelligently  
✅ Evaluates candidates across multiple dimensions  
✅ Produces explainable rankings  
✅ Enables semantic recruiter search  
✅ Improves shortlist quality  

### Core Impact
- Better candidate discovery  
- Higher-quality shortlists  
- Reduced recruiter effort  
- Smarter hiring decisions  

---

# Why This Matters

Hiring is one of the highest-impact decisions any organization makes.

Yet most recruitment systems still rely on outdated filtering.

Talent Intelligence Engine introduces:
- Intelligence  
- Explainability  
- Human-like reasoning  

into candidate evaluation.

This is not just resume screening.

This is AI-assisted hiring intelligence.

---

# Future Improvements

- Fine-tuned ranking models  
- Bias reduction mechanisms  
- Interview intelligence scoring  
- Resume embeddings at scale  
- Production deployment  

---

# Submission Assets

- GitHub Repository  
- PPT / Architecture Deck  
- Ranked Output File  

---

# Team Vision

> The best candidates are not always the loudest on paper.  
> Many are hidden in plain sight.

We built Talent Intelligence Engine to help recruiters find them.

Hiring should be smarter.  
We’re building the future of recruitment intelligence.
