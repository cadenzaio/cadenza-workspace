# Cadenza Learning Path

Date: 2026-07-23
Status: current public learning authority

This is the shortest public path for becoming an effective Cadenza application
author or contributor. The goal is to learn how the system preserves business
meaning while its runtime layers absorb deployment, authority, distribution,
containment, scale, recovery, and evidence responsibilities.

## What Agents Must Understand

Before changing behavior or contracts, an agent should be able to explain:

1. The intended whole and the difference between `Task`, `Signal`, `Intent`,
   inquiry, and `Actor`.
2. Why a graph coordinates work while result composition is an explicit
   contract built around that graph.
3. The separation between serialized definition authority, controlled callable
   materialization in a Chamber, and primitive materialization in a core.
4. Which official repository owns primitive meaning, durable authority,
   contained execution, trusted hosting, transport, or proof consumption.
5. How local graph, distribution, overarching trace, and custody identities
   preserve one execution story without collapsing their meanings.
6. How Cadenza extends higher-level features through its own primitives while
   core, Cell, and Chamber substrate code remains ordinary implementation.
7. Why the long-term direction is database-native without making unimplemented
   future concepts part of the current release contract.

## Reading Order

1. Intent and system overview:
   - [cadenza-intended-whole.md](./cadenza-intended-whole.md)
   - [architecture.md](./architecture.md)
   - [architecture/atlas/README.md](./architecture/atlas/README.md)
2. Application authoring and primitive behavior:
   - [guides/application-author.md](./guides/application-author.md)
   - [../cadenza/README.md](../cadenza/README.md)
   - [cadenza-flow-design.md](./cadenza-flow-design.md)
3. Repository and contract authority:
   - [workspace-map.md](./workspace-map.md)
   - [../contracts.config.json](../contracts.config.json)
   - [agent-harness/repo-cards/README.md](./agent-harness/repo-cards/README.md)
4. Durable Environment authority:
   - [../cadenza-environment/README.md](../cadenza-environment/README.md)
   - [contracts/environment-bootstrap/v0.md](./contracts/environment-bootstrap/v0.md)
   - [contracts/authority-security/v0.md](./contracts/authority-security/v0.md)
5. Governed execution and distribution:
   - [../cadenza-chamber/README.md](../cadenza-chamber/README.md)
   - [../cadenza-cell/README.md](../cadenza-cell/README.md)
   - [cadenza-language-runtime-contract.md](./cadenza-language-runtime-contract.md)
   - [contracts/distribution/v0.md](./contracts/distribution/v0.md)
   - [contracts/execution-evidence/v0.md](./contracts/execution-evidence/v0.md)
6. Realistic outside-in use:
   - [../cadenza-reference-system/README.md](../cadenza-reference-system/README.md)
   - [guides/runtime-operator.md](./guides/runtime-operator.md)
   - [guides/evidence-interpretation.md](./guides/evidence-interpretation.md)
7. Language portability:
   - [cadenza-language-role-doctrine.md](./cadenza-language-role-doctrine.md)
   - [../cadenza-python/README.md](../cadenza-python/README.md)
   - [../cadenza-elixir/README.md](../cadenza-elixir/README.md)
   - [../cadenza-csharp/README.md](../cadenza-csharp/README.md)
8. Longer-term direction and proposal material:
   - [vision.md](./vision.md)
   - [cadenza-environment.md](./cadenza-environment.md)
   - [cadenza-schema-proposal.md](./cadenza-schema-proposal.md)

## Working Heuristics

- Keep intended business function and workflow readable without deployment,
  placement, persistence, or transport concerns.
- Prefer tasks, actors, intents, and signals for higher-level behavior. Use
  helpers for repeated low-level operations or justified hot paths.
- Use `inquire(...)` for request/response and `emit(...)` for detached work;
  do not model task-to-task execution as a direct call.
- Preserve explicit identity, state, authority, failure meaning, and evidence
  at every boundary.
- Update the authority repository first and propagate shared contracts through
  checked fixtures.
- Treat core as persistence- and authority-agnostic. Treat callable source as
  data until a controlled Chamber adapter materializes it.
- Prefer designs that can migrate into the database-native graph without
  pretending that deferred Facts, Memory, UI, agents, or plugins already exist.
- Use legacy repositories only as historical evidence. They do not own current
  contracts or implementation direction.

## Competency Checks

Before making a non-trivial change, the agent should answer yes to these:

- Can I name the intended whole this change serves and its false-success case?
- Can I identify the official repository and contract that own the meaning?
- Can I explain the affected identities, state transitions, authority, evidence,
  and failure outcomes?
- Do I know which direct consumers and conformance fixtures must be updated?
- Can an application author still express the business flow without learning
  substrate topology?
- Is the distinction between current implementation and future proposal clear?

If not, stop and read deeper before editing.
