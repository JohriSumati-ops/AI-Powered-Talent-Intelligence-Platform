# Talent Intelligence Engine — Frontend

Recruiter-grade Next.js frontend for the Talent Intelligence Platform backend
(FastAPI + Groq/Llama + FAISS). Built against the backend's exact routes —
no invented endpoints, no backend changes.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · TanStack Query ·
Axios · Zustand · Framer Motion · lucide-react · Radix UI primitives · Recharts

## Getting started

```bash
npm install
cp .env.local.example .env.local
# edit .env.local and point NEXT_PUBLIC_API_BASE_URL at your running backend
npm run dev
```

The app runs at `http://localhost:3000`. It expects the backend from the
`backup/` repo running at the URL in `NEXT_PUBLIC_API_BASE_URL` (default
`http://localhost:8000`), started via that repo's own instructions
(`uvicorn src.main:app --reload` or equivalent).

## Why there's a "load candidates" step

The backend has **no candidate storage/upload endpoint** — `Candidate[]` is
always supplied directly inside the request body of `/ranking/rank`,
`/compare`, `/chat`, and optionally `/retrieval/retrieve`. There is no
persistence layer for candidates in the backend, so the frontend owns that
state for the duration of a browser session (via Zustand + `sessionStorage`)
and re-sends it on every relevant call. The Ranking page supports three ways
to populate that pool: JSON/CSV file upload, a manual entry form, or a
bundled demo dataset.

## Project structure

```
app/
  page.tsx                    Landing page
  (app)/                      Recruiter workspace (shared sidebar + topbar)
    dashboard/                Session snapshot: JD status, candidate pool, last ranking
    jd-parser/                POST /jd/parse-jd
    ranking/                  POST /ranking/rank  (+ load candidates)
    ranking/[id]/             Per-candidate explainability (client-side, from session state)
    compare/                  POST /compare
    retrieval/                POST /retrieval/retrieve
    chat/                     POST /chat
    settings/                 API health check, theme, session management
components/
  layout/                     Sidebar, Topbar
  ui/                         Button, Card, Badge, Input, Dialog, Progress, Skeleton
  domain/                     CandidateCard, ScoreRing, DimensionBars, UploadDropzone, etc.
lib/
  api/                        One file per backend router — request/response typed 1:1 to Pydantic
  types/                      TypeScript mirror of src/models/*.py
  store/                      Zustand: session state (JD/candidates/rankings), theme
  hooks/                      TanStack Query mutations wrapping lib/api
  utils/                      cn(), scoring/formatting helpers, candidate file parser
  data/                       Bundled demo dataset
```

## Backend contract reference

| Endpoint | Method | Notes |
|---|---|---|
| `/jd/parse-jd` | POST | `{jd_text}`, min 20 chars or the backend 400s |
| `/ranking/rank` | POST | `{parsed_jd, candidates[]}` → `CandidateScore[]` sorted by `final_score` |
| `/retrieval/retrieve` | POST | `{job_description, top_k, candidates?}` — omit `candidates` to search the backend's persisted FAISS index instead of an ephemeral one |
| `/compare` | POST | `{parsed_jd, candidate_a, candidate_b}` |
| `/chat` | POST | `{parsed_jd, candidates[], question}` — fully stateless, full context resent every turn |
| `/health` | GET | Used for the "Connected" indicator in the topbar and Settings |

The backend is treated as frozen. If a page needs data the backend doesn't
provide (e.g. persisted multi-tenant analytics), the frontend derives it from
the current session's data instead of inventing an endpoint — see the
Dashboard page, which reflects the live session rather than fake global
metrics.

## Notes on scope

- No auth layer — the backend has none.
- No dark/light system-preference detection is required by the brief, but
  the theme toggle in Settings/Topbar covers both, defaulting to dark.
- Error states, loading skeletons, and empty states are implemented per-page
  rather than only globally, since each page's failure mode differs (e.g.
  JD-too-short vs. empty candidate pool vs. unreachable backend).
