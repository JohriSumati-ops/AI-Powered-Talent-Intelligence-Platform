from pathlib import Path

import pandas as pd
from docx import Document

from adapter import load_candidates
from local_jd_parser import parse_job_description
from src.services.ranking_service import rank_candidates


BASE_DIR = Path(__file__).parent

INPUT_DIR = BASE_DIR / "input"
OUTPUT_DIR = BASE_DIR / "output"

OUTPUT_DIR.mkdir(exist_ok=True)


def read_docx(path: Path) -> str:
    doc = Document(path)
    return "\n".join(p.text for p in doc.paragraphs)


def main():

    print("Reading Job Description...")

    jd_text = read_docx(INPUT_DIR / "job_description.docx")

    print("Parsing JD...")

    parsed_jd = parse_job_description(jd_text)

    print("Loading Candidates...")

    candidates = load_candidates(
        str(INPUT_DIR / "sample_candidates.json")
    )

    print(f"Loaded {len(candidates)} candidates")

    print("Ranking...")

    ranked = rank_candidates(parsed_jd, candidates)

    rows = []

    for rank, candidate in enumerate(ranked, start=1):

        rows.append(
            {
                "candidate_id": candidate.candidate_id,
                "rank": rank,
                "score": round(candidate.final_score / 100, 4),
                "reasoning": candidate.explanation.overall_summary,
            }
        )

    df = pd.DataFrame(rows)

    csv_path = OUTPUT_DIR / "submission.csv"
    xlsx_path = OUTPUT_DIR / "submission.xlsx"

    df.to_csv(csv_path, index=False)
    df.to_excel(xlsx_path, index=False)

    print()
    print("Done!")
    print(csv_path)
    print(xlsx_path)


if __name__ == "__main__":
    main()