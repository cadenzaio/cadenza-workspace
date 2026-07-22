#!/usr/bin/env bash
set -euo pipefail

workspace_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

required_files=(
  "AGENTS.md"
  "README.md"
  "contracts.config.json"
  "automation.config.json"
  "docs/index.md"
  "docs/cadenza-learning-path.md"
  "docs/vision.md"
  "docs/cadenza-intended-whole.md"
  "docs/agent-harness/README.md"
  "docs/agent-harness/golden-principles.md"
  "docs/agent-harness/quality-score.md"
  "docs/agent-harness/templates/design-proposal.md"
  "docs/agent-harness/templates/execution-plan.md"
  "docs/agent-harness/templates/coherence-review.md"
  "docs/agent-harness/templates/assumptions.md"
  "docs/agent-harness/templates/clarification-comment.md"
  "docs/agent-harness/exec-plans/README.md"
  "docs/agent-harness/exec-plans/completed/2026-07-09-planning-hygiene-sprint-0.md"
  "docs/agent-harness/exec-plans/active/2026-07-09-cadenza-official-roadmap.md"
  "docs/agent-harness/repo-cards/README.md"
  "docs/references/openai-harness-engineering-2026-02-11.md"
  "scripts/workspace-snapshot.sh"
)

repo_cards=(
  "cadenza"
  "cadenza-python"
  "cadenza-elixir"
  "cadenza-csharp"
  "cadenza-environment"
  "cadenza-integrations"
  "cadenza-service"
  "cadenza-db"
  "cadenza-ui"
  "cadenza-demo"
  "cadenza-demo-2"
  "cadenza-demo-service"
  "cadenza-engine"
)

missing=0

for path in "${required_files[@]}"; do
  if [[ ! -f "$workspace_root/$path" ]]; then
    echo "Missing required file: $path"
    missing=1
  fi
done

for repo in "${repo_cards[@]}"; do
  card_path="$workspace_root/docs/agent-harness/repo-cards/$repo.md"
  if [[ ! -f "$card_path" ]]; then
    echo "Missing repo card: docs/agent-harness/repo-cards/$repo.md"
    missing=1
  fi
done

agents_lines="$(wc -l < "$workspace_root/AGENTS.md" | tr -d ' ')"
if (( agents_lines > 190 )); then
  echo "AGENTS.md is too long for a fast entrypoint: ${agents_lines} lines"
  missing=1
fi

if ! grep -q "docs/index.md" "$workspace_root/AGENTS.md"; then
  echo "AGENTS.md must point to docs/index.md"
  missing=1
fi

if ! grep -q "docs/cadenza-learning-path.md" "$workspace_root/AGENTS.md"; then
  echo "AGENTS.md must point to docs/cadenza-learning-path.md"
  missing=1
fi

if ! grep -q "scripts/workspace-snapshot.sh" "$workspace_root/README.md"; then
  echo "README.md must reference scripts/workspace-snapshot.sh"
  missing=1
fi

if ! grep -q "docs/vision.md" "$workspace_root/README.md"; then
  echo "README.md must reference docs/vision.md"
  missing=1
fi

if ! grep -q "cadenza-intended-whole.md" "$workspace_root/docs/index.md"; then
  echo "docs/index.md must reference cadenza-intended-whole.md"
  missing=1
fi

if ! grep -q "Harness Engineering" "$workspace_root/docs/references/openai-harness-engineering-2026-02-11.md"; then
  echo "Reference note is missing the harness engineering citation"
  missing=1
fi

legacy_terms=(
  "Ready for Codex"
  "In Progress (Codex)"
  "policy-approved"
  "gating_label"
)

for term in "${legacy_terms[@]}"; do
  if rg -n --fixed-strings "$term" \
    "$workspace_root/AGENTS.md" \
    "$workspace_root/README.md" \
    "$workspace_root/automation.config.json" \
    "$workspace_root/docs" \
    "$workspace_root/.github" >/dev/null 2>&1; then
    echo "Legacy workflow term still present: $term"
    missing=1
  fi
done

if (( missing != 0 )); then
  echo "Agent harness check failed."
  exit 1
fi

echo "Agent harness check passed."
