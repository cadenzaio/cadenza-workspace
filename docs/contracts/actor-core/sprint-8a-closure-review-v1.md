# Sprint 8A Actor Core Contract Repair Closure Review V1

Date: 2026-07-20

## Status

- Implementation state: `done`.
- Scope: minimal actor semantics, task-side actor binding, strict local keyed
  execution, four-language conformance, and Chamber runtime-image alignment.
- Closure approval: `Sprint 8A closure approved.` received on 2026-07-20.
- Next phase: Sprint 8B assignment and residency is active.

## Intended Whole

Application authors express keyed business state and the tasks that read or
transform it. They do not coordinate task ownership, state commit timing,
runtime placement, or persistence through business logic.

Sprint 8A establishes the smallest coherent local meaning on which those later
runtime responsibilities can depend.

## Delivered Contract

The shared [Actor Core Contract V1](v1.md) and canonical
[`v1-actor-core.json`](fixtures/v1-actor-core.json) fixture now define:

- an actor as non-executable keyed state authority.
- ordinary tasks as the only executable primitive.
- `cadenza.actor.binding.v1` as the task-side declaration of actor authority,
  read/write access, user/manager role, and local/signal-mediated interaction.
- explicit separation between actor definition identity and runtime state key.
- strict same-key sequencing with independent-key concurrency.
- candidate state that commits only after successful handler execution.
- durable and runtime versions that advance at most once per successful
  execution that changes the corresponding state.
- a persistence-agnostic core boundary.

## Repository Results

- `cadenza` is the working TypeScript implementation authority. Its actor
  definition is semantic-only, task bindings are normal extensions, invocation
  identity is `stateKey`, and legacy nested task/runtime policy surfaces are
  removed.
- `cadenza-python` expresses the same meaning with decorators, `asyncio.Lock`
  per state key, deep candidate copies, and `state_key` conventions.
- `cadenza-elixir` uses immutable candidate maps and BEAM-native per-key
  transactions while retaining the same external meaning.
- `cadenza-csharp` uses per-key monitors, canonical JSON actor records, deep
  JSON-like candidate copies, and task-side binding records.
- `cadenza-chamber` now materializes actors before ordinary tasks, carries actor
  binding on `RuntimeTaskDefinition`, rejects nested actor tasks and
  transitional actor policy, and requires manager bindings to use meta tasks.
- `cadenza-cell` is intentionally unchanged because Sprint 8A defines local
  semantics and runtime-image shape, not distributed ownership.

## Scenario Coverage

The shared and language-specific tests cover:

- canonical semantic definition round-trip and canonical binding meaning.
- declarative, callable, explicit, and default state-key selection.
- actor invocation options excluded from business input.
- independent state for multiple keys.
- read bindings rejecting every state mutator.
- failed handlers leaving durable state, runtime state, and versions unchanged.
- multiple mutations in one successful execution advancing each changed
  version only once.
- same-key read/write serialization and distinct-key concurrency.
- direct mutation of supplied state snapshots not changing actor authority.
- Chamber activation rejecting unsupported binding versions, unknown actor
  references, manager bindings on business tasks, and forbidden legacy fields.
- real TypeScript Chamber materialization and execution with the task-side
  runtime image.

## Coherence Review

### Intent And Authority

The actor owns state meaning; the task owns executable behavior; the binding
states their relationship. No object claims two forms of authority, and no
runtime placement or persistence decision is disguised as actor semantics.

### State And Time

One state key has one local sequence. Candidate mutation and commit are
separate moments. Failure cannot expose candidate state, and version movement
records successful state transition rather than mutator call count.

### Boundary

The core materializes primitives from already materialized callables. Chamber
materializes callable source in its controlled adapter. Persistence, ownership,
residency, fencing, recovery, and network routing remain outside the primitive
contract for Sprint 8B through 8D.

### Language Freedom

The APIs are not literal translations. TypeScript uses camel-case authoring,
Python uses decorators and snake case, Elixir uses immutable maps and BEAM
coordination, and C# uses records and monitors. Canonical JSON and observable
meaning remain shared.

### Operational Complexity

Sprint 8A adds one extension identifier, one binding per task at most, and one
per-key local sequence. It removes nested actor-task catalogs and several
policy surfaces. This is a net reduction in runtime-image and authoring
complexity.

## Dead-Code And Drift Screen

Active source across the four cores and Chamber contains no
`RuntimeActorTaskDefinition`, `RuntimeActorTaskMode`, nested `actorTasks`, or
legacy actor policy implementation. Remaining retry and idempotency references
belong to ordinary task execution, transport, or authority operations and are
not actor-definition drift.

## Deferred Risk

- Sprint 8A does not provide persistence, global ownership, residency,
  fencing, handoff, or recovery. Local correctness must not be mistaken for
  distributed safety.
- State remains JSON-centric at the shared boundary. Language-native runtime
  values are local conveniences and cannot silently enter distributed actor
  authority.
- High-cardinality queue and residency pressure are Sprint 8D concerns.

No unresolved coherence concern blocks Sprint 8A closure.

## Validation

- TypeScript: build, 13 actor tests, and all 149 non-performance tests. The four
  machine-sensitive performance tests remain deferred until the agreed clean
  computer restart; the latest full run reproduced CPU, timeout, memory, and
  cascading reporter-capacity failures and is not counted as a green suite.
- Python: compile check and 100 tests.
- Elixir: formatting check and 85 tests.
- C#: formatting check, warning-free build, and 56 tests.
- Chamber: adapter build, Rust formatting, clippy with warnings denied, full
  Rust tests, hostile activation tests, and 10 real TypeScript adapter tests.

## Closure

Sprint 8A closure was approved on 2026-07-20. Sprint 8B will define assignment
authority and single-owner fencing; it must not reopen actor semantic authority
without a new justified contract decision.
