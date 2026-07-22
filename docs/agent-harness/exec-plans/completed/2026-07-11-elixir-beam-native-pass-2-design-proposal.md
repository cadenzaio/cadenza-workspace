# Elixir BEAM-Native Pass 2 Design Proposal

## Status

done

Closed on 2026-07-12 after the Pass 2 closure review.

## Context

- Problem: `cadenza-elixir` Pass 1 proves boring core parity for non-scheduler semantics, but throttle, debounce, squash, richer signal metadata, and deeper local runtime isolation remain deferred.
- Why now: The user approved closing Pass 1 and moving into deeper Elixir/BEAM-native solutions.
- Evidence:
  - Pass 1 validation passes with 44 tests.
  - JSON conformance runner covers implemented shared-core fixture subsets.
  - Remaining fixture gaps are scheduler/signal delivery semantics rather than primitive identity or definition semantics.

## Proposed Approach

- Change summary:
  - Keep the public facade stable: `Cadenza.create_task`, `run`, `emit`, `inquire`, actors, schemas, snapshots.
  - Introduce private BEAM scheduler components for task execution policies and signal delivery policies.
  - Move runtime registry and schedulers under application-owned OTP lifecycle while keeping process topology private.
  - Keep process topology private unless a later design proves public runtime configuration is necessary.

- Why this shape:
  - The shared Cadenza contract is primitive meaning, not how a language stores or schedules it.
  - BEAM gives us real process isolation, message passing, monitors, supervision, and timers; throttle/debounce/squash are exactly the places where those features should improve the implementation.
  - A future supervised local runtime can still remain persistence-agnostic and non-distributed.

- Non-goals:
  - Do not introduce chamber/cell/distribution behavior into core.
  - Do not expose BEAM process IDs, supervisors, registries, ETS tables, or GenServer calls as the primary user API.
  - Do not make macros the main authoring surface in this pass.
  - Do not implement memory, CLI, persistence, actor sessions, orchestration, or remote transport.

## Proposed Internal Architecture

### Public Contract

The public contract should remain primitive-first:

- task definitions and stable keys
- helper/global aliases
- signal and intent names
- actor state access through actor tasks
- schema validation
- key-first snapshots
- JSON conformance/interchange

### Runtime Boundary

Target private runtime shape over time:

- `Cadenza.Runtime.Supervisor`
  - owns runtime lifecycle
  - starts private services
- `Cadenza.Runtime.Registry`
  - owns task/helper/global/intent/signal/actor definitions
  - owns observer/responder indexes, signal emission history, and actor state
  - replaces the broad Agent map or wraps it during migration
- `Cadenza.Runtime.Executor`
  - runs task graphs
  - owns run-local state such as unique fan-in joins
  - delegates policy decisions to scheduler components
- `Cadenza.Runtime.SignalBus`
  - owns local signal observer routing and emission metadata
  - supports synchronous facade behavior while internally using message passing where useful
- `Cadenza.Runtime.Snapshot`
  - owns key-first export shape for runtime definitions
  - keeps serialization/view concerns out of the public facade
- `Cadenza.Runtime.ActorRunner`
  - owns local actor context construction, keyed state lookup, and write-mode mutation collection
  - keeps actor state mechanics private to core runtime internals
- `Cadenza.Runtime.Scheduler`
  - owns timers and keyed policy state for throttle/debounce/squash

These modules remain private implementation detail unless a later proposal exposes an explicit runtime object.

Implementation note, 2026-07-11: scheduler semantics were implemented first with private named GenServers. A lazy supervisor attempt was backed out because it linked lifecycle to arbitrary caller/test processes. The successful shape is application-owned OTP supervision through `Cadenza.Application`, with process topology remaining private.

Implementation note, 2026-07-11: the initial `Cadenza` facade became too broad after scheduler, signal, snapshot, and actor support landed. It has been split so the facade preserves public composition while private runtime modules own execution, signal routing, snapshot export, and actor state handling.

Implementation note, 2026-07-12: the broad runtime Agent has been split into `Cadenza.Runtime` as a private supervisor/facade and `Cadenza.Runtime.Registry` as the local state owner. This keeps registry identity explicit while preserving the public `Cadenza` contract and existing internal runtime API.

### Scheduler Semantics

Implement scheduler behavior as local execution policy:

- Task throttle:
  - keyed by task key plus tag
  - same tag serializes execution
  - different tags may run independently
  - no persistence or distributed coordination
- Task debounce:
  - keyed by task key plus debounce group
  - burst collapses to the latest context for trailing debounce
  - timer ownership lives in scheduler
- Signal debounce:
  - keyed by signal name
  - latest payload wins after delay
- Signal squash:
  - keyed by signal name
  - payloads merge until delivery
  - one delivery emitted with merged payload

### Conformance Mapping

Pass 2 implementation should first target:

- `runtime_throttle`
- `runtime_debounce`
- `signal_metadata`
- `signal_debounce`
- `signal_squash`

Existing covered cases must remain green:

- `core_identity`
- `definitions_snapshot`
- `schema_inquiry`
- `runtime_execution`
- `runtime_retry`
- `runtime_ephemeral`

## Impacted Repos

- Authority repo: `cadenza` remains shared contract authority.
- Direct repo: `cadenza-elixir`.
- Workspace docs:
  - `docs/cadenza-elixir-translation-readiness.md`
  - `docs/agent-harness/exec-plans/completed/2026-07-11-elixir-beam-native-pass-2-design.md`

## Risks

- Breaking change risk:
  - Medium if runtime internals change task mutation or snapshot ordering.
  - Public API should remain stable unless explicitly approved.
- Migration or rollout risk:
  - Current Pass 1 runtime is simple; replacing it with supervised internals could create complexity without enough payoff if overbuilt.
- Testing risk:
  - Timer/concurrency tests can be flaky. Tests should use short but stable timings and prefer deterministic scheduler hooks where possible.

## Migration Strategy

- Order of operations:
  1. Preserve Pass 1 facade and tests.
  2. Introduce private runtime modules behind existing `Cadenza.Runtime`.
  3. Move registry behavior first without changing semantics.
  4. Add signal emission metadata.
  5. Add signal debounce/squash.
  6. Add task throttle/debounce.
  7. Expand JSON conformance runner to cover the remaining fixture cases.

- Backward compatibility plan:
  - No legacy compatibility requirement across old repos.
  - Maintain Pass 1 public API within `cadenza-elixir` unless a coherence issue requires a documented change.

- Validation plan:
  - ExUnit coverage for each scheduler policy.
  - JSON conformance fixture coverage for each implemented scheduler/signal case.
  - `mix compile --warnings-as-errors`.
  - Snapshot JSON encoding through `Jason`.

## Alternatives

- Option A: Keep Agent runtime and implement timers with ad hoc process spawning.
  - Lower upfront work.
  - Risks building a half-BEAM model that becomes harder to repair.
- Option B: Expose an explicit runtime object and make users start supervisors manually.
  - More idiomatic for embedded Elixir systems.
  - Too much public surface for core Pass 2 unless proven necessary.
- Option C: Jump directly to chamber-like runtime.
  - More ambitious.
  - Violates current boundary: chamber belongs later and likely in its own repo.

Recommended: supervised private internals behind the stable facade.

## Assumptions

- Local runtime semantics are enough for core; distributed scheduling is out of scope.
- Timer-driven tests can be made reliable enough with conservative delays or internal test hooks.
- BEAM-native internals should improve correctness and clarity, not become a public identity of the core contract.
