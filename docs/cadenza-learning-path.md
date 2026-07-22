# Cadenza Learning Path

This document is the agent ramp for becoming effective in the Cadenza workspace.

The priority is not just editing code. The priority is learning how Cadenza wants systems to be modeled so future changes strengthen the platform instead of fighting it.

## What Agents Must Understand

Before changing core behavior, an agent should be able to explain:

1. The difference between `Task`, `Signal`, `Intent`/inquiry, and `Actor`.
2. When work should be modeled as local orchestration, distributed request/response, or event fan-out.
3. How runtime state differs from durable actor state.
4. How metadata flows from `cadenza` to `cadenza-service` to `cadenza-db`.
5. How Cadenza can extend itself using its own primitives and metadata layer.
6. Why the long-term direction is database-native rather than endlessly growing file-based repos.

## Reading Order

1. Core model:
   - [../cadenza/README.md](../cadenza/README.md)
2. Distributed model:
   - [../cadenza-service/README.md](../cadenza-service/README.md)
3. Database-backed usage:
   - [postgres-actor-guide.md](./postgres-actor-guide.md)
   - [postgres-actor-reference.md](./postgres-actor-reference.md)
4. Cross-repo context:
   - [architecture.md](./architecture.md)
   - [workspace-map.md](./workspace-map.md)
   - [product.md](./product.md)
5. Long-term direction:
   - [vision.md](./vision.md)
6. Database-native flow authoring:
   - [cadenza-environment.md](./cadenza-environment.md)
   - [cadenza-schema-proposal.md](./cadenza-schema-proposal.md)
   - [cadenza-flow-design.md](./cadenza-flow-design.md)

## Working Heuristics

- Prefer expressing new capability as Cadenza primitives instead of ad hoc side-channel glue.
- Preserve introspection. New behavior should emit or expose enough structure for agents and humans to reason about it later.
- Respect contract authority. Update the owning repo first.
- Avoid file-only assumptions that make future database-native migration harder.
- Ask whether a behavior belongs as graph data, actor state, intent, inquiry, signal, or schema before inventing a one-off abstraction.
- Choose the least strict flow that still preserves the semantic contract.
- Never model task-to-task execution as a direct call. Within task logic, use `inquire(...)` for request/response and `emit(...)` for detached work.

## Competency Checks

Before making a non-trivial change, the agent should answer yes to these:

- Can I explain why this belongs in core, service, DB, UI, or demo code?
- Do I know how this change affects tasks, signals, intents, actors, or persisted metadata?
- Do I know what downstream repo or docs will need updating?
- Is this change aligned with the direction toward a queryable, executable graph as the main system of record?

If not, stop and read deeper before editing.
