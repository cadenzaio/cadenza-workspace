# Workspace Agent Contract

This file defines workspace-level governance for `https://github.com/cadenzaio/cadenza-workspace`. Repo-level `AGENTS.md` files may extend this contract, but they may not override workflow states, WIP limits, clarification policy, assumptions policy, complexity gates, contract governance, or multi-repo git discipline.

## Quick Start

1. Treat workspace root as a meta repo only. Never commit product code from root.
2. Open [README.md](README.md), [docs/index.md](docs/index.md), and the relevant repo card under [docs/agent-harness/repo-cards/](docs/agent-harness/repo-cards/README.md).
3. Before any cross-repo task, run `./scripts/workspace-snapshot.sh`.
4. Before any root-doc change, run `./scripts/check-agent-harness.sh`.
5. Before any git command, confirm the current working directory is the intended repo.

## Workspace Priorities

1. Help agents become skilled users and builders of Cadenza by routing them to the right documentation first.
2. Preserve the long-term direction toward a database-native Cadenza where only the necessary bootstrap/runtime code remains in file-based repos.
3. Keep cross-repo changes explicit, reversible, and authority-first.

## Primitive-First Implementation

- Evolve Cadenza mainly by composing Cadenza primitives.
- Prefer flat task and signal graphs over deep nested helper-function call graphs.
- Use signals as fire-and-forget detach points when a response contract is not required.
- Reuse tasks across multiple flows by cloning tasks when the task behavior is the same.
- Prefer helper functions only for repeated low-level operations, normalization, or hot-path logic where primitive-only modeling would hurt performance or clarity.
- When deciding between a helper function and a primitive flow, bias toward tasks, actors, intents, and signals first. Routine grouping is legacy; tag grouping owns that future concern.

## Workspace Structure

- Workspace root is a meta repository for governance, docs, decisions, and automation config.
- Official child directories such as `cadenza/`, `cadenza-cell/`, and `cadenza-chamber/` are independent repositories. Legacy repositories are reference-only and do not own current direction.
- Always `cd` into the target repo before running repo-local git commands.
- Never commit changes across multiple child repos in one git operation.

## Direct Task Workflow

- Work is assigned directly by the user in Codex.
- For substantial work, create or update an execution plan under `docs/agent-harness/exec-plans/active/`.
- Preferred plan states are `queued`, `in_progress`, `blocked`, `review_needed`, and `done`.
- Keep one active implementation stream per agent unless the user explicitly decides otherwise.
- Use Linear as a lightweight backlog for follow-up work that is outside the current task scope.
- When bug findings, feature gaps, ideas, or cleanup work appear during implementation and are not part of the current task, create a Linear issue so they do not get lost.
- Default those issues to `Backlog`. Treat Linear as capture and prioritization, not as the primary execution-state tracker for the current Codex task.
- Only use labels that improve later filtering or triage. Do not require a heavy issue template for quick capture.
- Close each task with validation results, remaining risks, and the next obvious follow-up.

## WIP And Waiting Limits
- Active WIP: max `1`
- Waiting or blocked work: max `2`

If the waiting cap is reached, do not start new work. Resume the oldest waiting item first.

## Clarification Protocol
If confidence is below `0.7` because acceptance criteria are ambiguous:

1. Ask up to three precise questions in a single message.
2. If an execution plan exists, record the blocker there.
3. Stop execution.
4. Resume only after clarification.

If ambiguity survives two rounds, present two or three concrete options with tradeoffs and ask for an explicit choice.

Never guess silently.
Use [docs/agent-harness/templates/clarification-comment.md](docs/agent-harness/templates/clarification-comment.md) when you need a consistent comment format.

## Assumptions Policy
If uncertainty is minor and safe:

- Document assumptions under an exact `## Assumptions` heading.
- Ask for confirmation.
- If the user says "Use best judgment", record that approval in the plan or task summary and proceed.

- The task needs corrective follow-up shortly after completion.
- A follow-up task is created within 14 days.
- Contract drift is detected.

Repeated failed assumptions trigger policy review.
Use [docs/agent-harness/templates/assumptions.md](docs/agent-harness/templates/assumptions.md).

## Complexity Gate
Design approval is required before implementation if any of the following apply:

- Multi-repo change affecting shared contracts
- Schema or migration change
- Auth, billing, permissions, or core domain logic
- More than roughly `200` LOC expected
- Architectural refactor
- New external dependency
- Ambiguous acceptance criteria

- Context
- Proposed approach
- Impacted repos
- Risks
- Migration strategy
- Alternatives

Wait for explicit approval: `Design approved. Proceed.`
Use [docs/agent-harness/templates/design-proposal.md](docs/agent-harness/templates/design-proposal.md), [docs/agent-harness/templates/execution-plan.md](docs/agent-harness/templates/execution-plan.md), and log approved decisions under [docs/decisions/](docs/decisions/README.md).

## Contract Governance
All contract changes must follow this checklist:

1. Identify the authority repo in [contracts.config.json](contracts.config.json).
2. Update the authority source first.
3. If the contract is shared, either propagate the change in the same task or create linked follow-up tasks.
4. Run typecheck or equivalent validation in all affected repos.
5. Add or update a contract snapshot test where applicable.

Breaking changes include:

- Field removal
- Type change
- Nullability change
- Required field change
- Enum or union modification

Breaking changes require explicit approval or a design-required phase.

## Multi-Repo Change Discipline

For multi-repo work:

- Use workspace-relative paths such as `cadenza-cell/src/...` in planning docs.
- Create separate branches per repo.
- If branches are used, use the same human-readable task slug in each branch name.
- Track cross-repo scope in one execution plan or summary note.

Never modify multiple repos in one commit.

## Documentation Governance

Root docs in this repo own:

- Cross-repo architecture
- Workflow rules
- Contract authority
- Decision logging
- Agent harness structure

Repo-local docs own:

- Commands
- Tooling
- Environment setup
- Repo-specific constraints

Documentation changes must:

- Cite evidence such as user direction, reports, decisions, or published references
- Be applied through an approved checkbox proposal when policy changes are involved
- Be implemented through the normal git workflow for the target repo

Root docs must not redefine repo-local commands that belong in child repos.

## Decision Logging

When a design-required task is approved:

- Create `docs/decisions/YYYY-MM-DD-<slug>.md`
- Include `Context`, `Decision`, `Consequences`, `Alternatives`, and `Links`
- Treat decisions as immutable; supersede them with a new file instead of rewriting history

## Execution Safety

Never:

- Modify production secrets
- Modify infrastructure without explicit instruction
- Silence failing tests
- Run destructive git commands from workspace root

Always:

- Confirm cwd before git commands
- Avoid `git add -A` from workspace root
- Keep root-repo commits limited to meta-repo files

## Key Entry Points

- Navigation index: [docs/index.md](docs/index.md)
- Cadenza learning path: [docs/cadenza-learning-path.md](docs/cadenza-learning-path.md)
- Product direction: [docs/vision.md](docs/vision.md)
- Agent harness: [docs/agent-harness/README.md](docs/agent-harness/README.md)
- Repo routing: [docs/agent-harness/repo-cards/README.md](docs/agent-harness/repo-cards/README.md)
- Cross-repo architecture: [docs/architecture.md](docs/architecture.md)
- Workspace topology: [docs/workspace-map.md](docs/workspace-map.md)
- Contract authority map: [contracts.config.json](contracts.config.json)
- Automation scaffolding: [automation.config.json](automation.config.json)
