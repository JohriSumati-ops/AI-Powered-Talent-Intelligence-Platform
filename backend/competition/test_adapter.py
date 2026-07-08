
from adapter import load_candidates

candidates = load_candidates("input/sample_candidates.json")

print("Loaded:", len(candidates))

print(candidates[0])