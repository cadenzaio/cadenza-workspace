# Cadenza Workspace (Meta Project)

This repository is the workspace-level meta project for the Cadenza ecosystem.

It owns cross-repo governance, documentation, decision logs, contract authority mapping, and automation scaffolding. It does not own product runtime code.

## Agent Entry Points

Start here when working from the workspace root:

- Governance: [AGENTS.md](./AGENTS.md)
- Knowledge index: [docs/index.md](./docs/index.md)
- Cadenza learning path: [docs/cadenza-learning-path.md](./docs/cadenza-learning-path.md)
- Long-term direction: [docs/vision.md](./docs/vision.md)
- Current implementation design: [Sprint 9 distributed foundation stabilization and publication](./docs/agent-harness/exec-plans/active/2026-07-21-distributed-foundation-stabilization-publication-design.md)
- Release operations:
  [docs/publication/sprint-9e-release-operations-v1.md](./docs/publication/sprint-9e-release-operations-v1.md)
- Agent harness: [docs/agent-harness/README.md](./docs/agent-harness/README.md)
- Repo routing cards: [docs/agent-harness/repo-cards/README.md](./docs/agent-harness/repo-cards/README.md)
- Snapshot command: `./scripts/workspace-snapshot.sh`
- Harness validation: `./scripts/check-agent-harness.sh`

## Boundaries

- Child directories are independent git repositories.
- Product code changes must be made inside the target child repo.
- Root-level changes should be limited to meta-project docs, validation scripts, and coordination config.
- Never commit changes across multiple child repos in one git operation.

## Repository Inventory And Ownership

Official forward repositories in this workspace:

- `cadenza/`
  - Responsibility: TypeScript core primitives, graph execution, and neutral runtime-evidence semantics.
  - Ownership domain: shared primitive meaning and current working implementation authority.
- `cadenza-python/`, `cadenza-elixir/`, `cadenza-csharp/`
  - Responsibility: official language translations of the neutral core contract.
  - Ownership domain: idiomatic primitive expression under shared conformance.
- `cadenza-environment/`
  - Responsibility: environment bootstrap, durable authority and policy, PostgreSQL persistence, reconciliation, supply, evidence-ledger processing, and distributed actor authority.
  - Ownership domain: durable environment state and the exact operations that change it.
- `cadenza-chamber/`
  - Responsibility: Rust chamber kernel, activation, immutable runtime images, adapter hosting, primitive ingress, and runtime evidence.
  - Ownership domain: chamber runtime substrate contracts.
- `cadenza-cell/`
  - Responsibility: Rust trusted cell host, deterministic containment and launch policy, chamber process custody, capability brokers, local/remote route interpretation, authenticated peer transport, evidence, and termination.
  - Ownership domain: cell runtime and transport substrate contracts. Durable placement authority remains in `cadenza-environment`.

Legacy and reference-only repositories include `cadenza-service/`, `cadenza-db/`, `cadenza-engine/`, current integrations/UI experiments, and demo repositories. They do not own the new major-version direction.

## Cross-Repo Workflow Summary

The source of truth for workflow governance is root [AGENTS.md](./AGENTS.md), including:

- direct Codex task flow
- clarification protocol
- assumptions policy
- complexity gate
- contract governance
- multi-repo change discipline

Use [docs/index.md](./docs/index.md) when you need the shortest route to the correct document or repo.

## Documentation Priorities

The most important knowledge in this workspace is:

1. How to use Cadenza effectively with its own primitives.
2. How current repos fit into the long-term database-native direction.
3. Which repo currently owns each contract while the system is still transitioning.

Agents should learn the system before changing the system. Start with [docs/cadenza-learning-path.md](./docs/cadenza-learning-path.md) and [docs/vision.md](./docs/vision.md) before making architectural changes.

## Work Safely

Inspect workspace root status:

```bash
git -C https://github.com/cadenzaio/cadenza-workspace status
```

Inspect the whole workspace before a cross-repo task:

```bash
https://github.com/cadenzaio/cadenza-workspace/blob/main/scripts/workspace-snapshot.sh
```

Validate the root harness after editing docs or scripts:

```bash
https://github.com/cadenzaio/cadenza-workspace/blob/main/scripts/check-agent-harness.sh
```

Work inside one child repo at a time:

```bash
cd https://github.com/cadenzaio/cadenza-workspace/blob/main/cadenza-cell
git status
```

## Meta-Project Files

- `AGENTS.md`: workspace governance
- `contracts.config.json`: contract authority map
- `automation.config.json`: recurring sweep scaffolding
- `docs/index.md`: top-level knowledge index for agents and humans
- `docs/cadenza-learning-path.md`: reading order and competency expectations for learning Cadenza
- `docs/vision.md`: long-term product and architecture direction
- `docs/agent-harness/`: templates, repo cards, quality score, and execution plans
- `docs/workspace-map.md`: topology and dependency map
- `docs/architecture.md`: cross-repo architecture and integration flows
- `docs/product.md`: ecosystem product surface and ownership boundaries
- `docs/decisions/README.md`: decision log convention
