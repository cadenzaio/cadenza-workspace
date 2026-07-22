# Agent Harness Quality Score

Last updated: 2026-03-23

This score is a lightweight sweep artifact for the workspace root. Update it when the harness changes materially or when recurring scans find drift.

| Area | Score | Evidence | Next ratchet |
|---|---|---|---|
| Navigation | 4/5 | `AGENTS.md` points into `docs/index.md`, the learning path, and repo cards | Add repo-local `AGENTS.md` entrypoints where repos still rely only on README files |
| Cadenza mastery | 4/5 | The workspace now has a dedicated learning path and product direction doc | Add more task-sized examples that show how Cadenza extends itself with its own primitives |
| Routing | 4/5 | Every child repo has a workspace repo card | Add command drift checks for repo cards versus local package scripts |
| Templates | 4/5 | Execution, design, assumptions, and clarification templates exist | Add a reusable change-summary template for direct multi-agent handoffs |
| Mechanical checks | 3/5 | Root harness check exists in CI | Expand checks to detect stale repo cards and broken markdown links |
| Proactive maintenance | 3/5 | Automation config names artifacts and expected outputs without relying on external ticket states; root workflow now documents Linear as backlog-only capture for out-of-scope follow-up work | Wire the planned weekly automations to update this file directly |

## Current Risks

- Several child repos still lack repo-local `AGENTS.md` files.
- Repo cards summarize commands manually and can drift from package scripts.
- `cadenza-engine/` is still mostly a placeholder, so its routing card is intentionally thin.
- The database-native target architecture is documented, but the migration path is still high-level.
- Linear capture is now documented at the workspace level, but no recurring sweep exists yet to triage stale backlog items.

## Next Sweep Targets

- Add repo-local entrypoint files to repos that only expose a README.
- Add a script to compare repo cards against package scripts and core docs.
- Add more examples that teach agents how to model new capability using tasks, signals, intents, actors, and persisted graph metadata.
- Promote completed harness work from the active plan into `exec-plans/completed/`.
