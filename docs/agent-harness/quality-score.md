# Agent Harness Quality Score

Last updated: 2026-07-23

This score is a lightweight sweep artifact for the workspace root. Update it when the harness changes materially or when recurring scans find drift.

| Area                  | Score | Evidence                                                                                                                                                                                     | Next ratchet                                                                              |
| --------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Navigation            | 5/5   | `AGENTS.md`, `docs/index.md`, the learning path, architecture atlas, and official repo cards form one current public path                                                                    | Keep current-authority link coverage in the release gate                                  |
| Cadenza mastery       | 4/5   | The workspace now has a dedicated learning path and product direction doc                                                                                                                    | Add more task-sized examples that show how Cadenza extends itself with its own primitives |
| Routing               | 4/5   | Every child repo has a workspace repo card                                                                                                                                                   | Add command drift checks for repo cards versus local package scripts                      |
| Templates             | 4/5   | Execution, design, assumptions, and clarification templates exist                                                                                                                            | Add a reusable change-summary template for direct multi-agent handoffs                    |
| Mechanical checks     | 4/5   | Root harness, public allowlist, current-authority link checks, contract snapshots, and deterministic atlas checks are release inputs                                                         | Add repo-card command drift checks without treating historical cards as current           |
| Proactive maintenance | 3/5   | Automation config names artifacts and expected outputs without relying on external ticket states; root workflow now documents Linear as backlog-only capture for out-of-scope follow-up work | Wire the planned weekly automations to update this file directly                          |

## Current Risks

- Repo cards summarize commands manually and can drift from package scripts.
- The database-native target architecture is documented, but the migration path is still high-level.
- Linear capture is now documented at the workspace level, but no recurring sweep exists yet to triage stale backlog items.

## Next Sweep Targets

- Add a script to compare repo cards against package scripts and core docs.
- Add more examples that teach agents how to model new capability using tasks, signals, intents, actors, and persisted graph metadata.
- Promote completed harness work from the active plan into `exec-plans/completed/`.
