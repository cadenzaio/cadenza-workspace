# Agent Harness

This folder is the agent-facing operating layer for the workspace meta repo.

It exists to keep `AGENTS.md` short and stable while moving volatile context, templates, routing, and cleanup loops into versioned files that can evolve through normal commits and direct Codex-managed sessions.

## Design Goals

- Make the next file obvious.
- Route agents into Cadenza learning material before they make architectural changes.
- Route agents into the correct child repo before they touch code.
- Encode the workspace's preferred decision patterns once.
- Keep recurring cleanup work explicit and visible.
- Add mechanical checks so harness drift is caught early.

Reference: [../references/openai-harness-engineering-2026-02-11.md](../references/openai-harness-engineering-2026-02-11.md)

## Operating Loop

1. Start with [../../AGENTS.md](../../AGENTS.md).
2. Use [../index.md](../index.md) to find the right domain.
3. Read [../cadenza-learning-path.md](../cadenza-learning-path.md) and [../vision.md](../vision.md) when the task affects platform semantics or direction.
4. Open the relevant repo card under [repo-cards/](./repo-cards/README.md).
5. Use templates under [templates/](./templates/) when the task hits ambiguity, assumptions, design gates, or needs a tracked execution plan.
6. Review [quality-score.md](./quality-score.md) and [exec-plans/](./exec-plans/README.md) before changing the harness itself.
7. Run `./scripts/check-agent-harness.sh` after editing this layer.

## Directory Map

- `repo-cards/`
  - entrypoint cards for each child repo
- `templates/`
  - standardized execution, design, clarification, and assumptions scaffolds
- `exec-plans/`
  - versioned active and completed harness plans
- `quality-score.md`
  - current assessment of harness quality and next ratchets
- `golden-principles.md`
  - compact rules derived from the harness engineering reference

## Ground Rules

- Keep root instructions additive and navigational, not encyclopedic.
- Bias the harness toward Cadenza mastery and long-term architectural understanding.
- Prefer linking to the authority doc over repeating it.
- When you add a new recurring rule, also add the check or artifact that keeps it alive.
- When a child repo gets materially more complex, add or update its repo card.
