#!/usr/bin/env bash
set -euo pipefail

workspace_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
repos=(
  "cadenza"
  "cadenza-python"
  "cadenza-elixir"
  "cadenza-csharp"
  "cadenza-environment"
  "cadenza-chamber"
  "cadenza-cell"
)

echo "Workspace root: $workspace_root"
echo

echo "Root status:"
git -C "$workspace_root" status --short || true
echo

echo "Contract authorities:"
python3 - "$workspace_root/contracts.config.json" <<'PY'
import json
import sys

with open(sys.argv[1], "r", encoding="utf-8") as fh:
    data = json.load(fh)

for key, value in data.get("authorities", {}).items():
    repo = value.get("authority_repo", "unknown")
    scopes = ", ".join(value.get("scope", []))
    print(f"- {key}: {repo} ({scopes})")
PY
echo

echo "Child repo status:"
for repo in "${repos[@]}"; do
  repo_path="$workspace_root/$repo"

  if [[ ! -d "$repo_path" ]]; then
    echo "- $repo: missing directory"
    continue
  fi

  if [[ ! -d "$repo_path/.git" ]]; then
    echo "- $repo: directory exists but is not initialized as a git repo"
    continue
  fi

  branch="$(
    git -C "$repo_path" symbolic-ref --short -q HEAD 2>/dev/null \
      || git -C "$repo_path" rev-parse --short HEAD 2>/dev/null \
      || echo "no-commits"
  )"
  dirty_count="$(git -C "$repo_path" status --short | wc -l | tr -d ' ')"
  last_commit="$(git -C "$repo_path" log -1 --pretty=format:'%h %cs %s' 2>/dev/null || echo 'no commits')"

  echo "- $repo"
  echo "  branch: $branch"
  echo "  dirty paths: $dirty_count"
  echo "  last commit: $last_commit"
done
echo

echo "Primary entrypoints:"
echo "- Governance: $workspace_root/AGENTS.md"
echo "- Knowledge index: $workspace_root/docs/index.md"
echo "- Repo cards: $workspace_root/docs/agent-harness/repo-cards/README.md"
echo "- Quality score: $workspace_root/docs/agent-harness/quality-score.md"
