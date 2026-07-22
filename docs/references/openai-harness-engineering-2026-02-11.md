# OpenAI Harness Engineering Reference

Source: [Harness Engineering](https://openai.com/index/harness-engineering/)
Published: 2026-02-11
Accessed: 2026-03-11

## Why This Reference Matters Here

The article argues that stronger agent outcomes come less from one giant instruction prompt and more from a repository harness that makes architecture, taste, plans, and cleanup loops legible inside the repo itself.

## Workspace-Specific Takeaways

- Keep the main instruction file short enough to trust and fast enough to read.
- Move dynamic guidance into versioned repository files instead of burying it in chat history.
- Add "system of record" artifacts such as repo cards, design templates, and execution plans.
- Create lightweight quality documents that expose current gaps and next ratchets.
- Add background cleanup loops so documentation and structure do not silently decay.

## Applied In This Workspace

- `AGENTS.md` was reduced to governance and routing.
- `docs/index.md` became the root navigation layer.
- `docs/agent-harness/repo-cards/` now routes agents into the right child repo.
- `docs/agent-harness/templates/` captures repeated decision patterns.
- `docs/agent-harness/quality-score.md` and `automation.config.json` make upkeep explicit.
- `scripts/check-agent-harness.sh` turns structure drift into a detectable failure.
