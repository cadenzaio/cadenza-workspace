# Distributed Actor Lifecycle And Persistence

Date: 2026-07-20

## Context

Sprint 7 completed the distributed placement, Cell supply, Chamber custody,
routing, recovery, and execution-evidence substrate. Actor state remained
Chamber-local and the live actor definitions still mixed semantic authority
with transitional runtime and persistence policies.

The first complete distributed Cadenza model requires actor state to move
between valid owners without exposing ownership, hydration, persistence,
fencing, or recovery coordination to application authors.

## Decision

Implement Sprint 8 in four sequential passes:

1. align all official core languages and Chamber runtime images on a minimal
   actor definition and task-side actor binding.
2. establish one PostgreSQL-authoritative owner assignment epoch per actor
   state key, with Cell-owned residency coordination and Chamber-owned loaded
   state.
3. add first-touch hydration and strict write-through persistence through an
   exact actor persistence extension while keeping the primitive core
   persistence-agnostic.
4. close drain, failure recovery, realtime evidence, pressure, security,
   operational complexity, and definitive Linux behavior.

Distributed actors have one global owner at a time and require durable
persistence. Chamber-local ephemeral actors make no failover promise. Healthy
assignments do not move merely because capacity changes.

Actor write handlers may compute candidate state and buffer signal emissions,
but may not inquire, delegate, or produce other external affect before commit.
Unknown commit outcomes reuse one stable actor mutation identity. Generated
single-task owner endpoints execute remote actor handlers without replaying the
authored task's downstream graph on the owner.

TypeScript remains the working primitive implementation authority. Python,
Elixir, and C# preserve shared semantic meaning through idiomatic APIs and
neutral conformance fixtures. Only TypeScript receives a live Chamber adapter
in Sprint 8.

## Consequences

- The transitional actor API is removed without backward-compatibility shims.
- PostgreSQL is required for successful distributed ownership, hydration,
  mutation, and failover.
- Actor assignment, state version, mutation, Cell generation, and Chamber
  generation remain distinct identities and fences.
- Strict per-key serialization is the initial correctness baseline; actor
  concurrency optimization is deferred.
- Write-behind, checkpointed, event-sourced, active-active, CRDT, and custom
  persistence modes are deferred.
- Raw actor state and state keys are excluded from default evidence and
  diagnostics.
- Sprint 8 closure requires a definitive Linux/gVisor multi-Cell recovery proof
  and recursive coherence review.

## Alternatives

### Embed Runtime Policy In Actor Definitions

Rejected because it couples primitive meaning to topology and persistence and
duplicates authority across languages.

### Let Cells Select Owners Independently

Rejected because concurrent Cells cannot prove one current global owner across
failure, delay, and restart without durable serialized authority.

### Permit Pre-Commit Nested Affect

Deferred because inquiry or delegation would require a separate distributed
transaction or outbox contract to remain coherent when actor commit fails.

### Begin With Multiple Persistence And Consistency Modes

Rejected because it multiplies failure semantics before strict write-through
authority has been proved end to end.

## Links

- [Completed Sprint 8 design](../agent-harness/exec-plans/completed/2026-07-20-distributed-actor-lifecycle-sprint-8-design.md)
- [Cadenza Intended Whole](../cadenza-intended-whole.md)
- [Persistence-Agnostic Core](./2026-07-11-persistence-agnostic-core.md)
- User approval: `Design approved. Proceed.` on 2026-07-20.
