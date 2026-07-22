# Cadenza C# Core Closure Review

Date: 2026-07-12

## Purpose

This review evaluates whether the first `cadenza-csharp` implementation pass should close as part of Sprint 1B official core translation work.

The review uses the current intended whole:

> Cadenza should reduce accidental coding complexity so humans and AI can focus on business logic, intended application function, workflow shape, and the logic inside individual tasks. Deployment, scale, distribution, placement, persistence, session lifecycle, and orchestration belong in later Cadenza layers rather than the core authoring model.

## Closure Verdict

`cadenza-csharp` Pass 1 is ready to close.

The repo proves that C# can express the shared primitive contract without pulling runtime adapter, Roslyn materialization, policy engine, persistence, chamber, cell, distribution, or meta-slice concerns into core.

The current implementation is intentionally a boring parity slice:

- public facade through `Cadenza`
- stable task, helper, global, and actor keys
- name-keyed intents and signals with current naming rules
- context execution, branch filtering, branch splitting, and unique fan-in
- explicit helper/global aliasing
- local inquiry and local signal emission
- callable-backed definitions from delegates only
- actor-bound tasks with keyed durable/runtime state and read/write mode enforcement
- key-first snapshots
- focused local tests and two language-neutral conformance fixtures

## Coherence Review

### Intended Whole

The implementation serves the intended whole because it lets an author express task flow and task-local logic without exposing runtime topology, deployment, persistence, or language materialization policy.

False success would be an impressive C# architecture that starts with Roslyn, dependency loading, DI containers, policy evaluators, backing stores, or enterprise service abstractions before proving the primitive core.

The current repo avoids that false success.

### Participating Identities

Current C# identities are clear:

- `Cadenza`: public coordination facade
- `CadenzaTask`: executable business-logic primitive
- `CadenzaActor`: local state authority primitive
- `CadenzaHelper` and `CadenzaGlobal`: explicit task dependencies
- `CadenzaIntent` and `CadenzaSignal`: name-keyed coordination primitives
- `CadenzaContext`: normalized context map
- `RuntimeRegistry`: internal in-memory primitive registry
- delegate contracts: already-materialized callable slots

This is coherent for Pass 1: public identities represent primitives, while the registry remains a private implementation detail.

### Boundary Assessment

The strongest boundary is the callable materialization boundary.

- Source strings are metadata only.
- Core receives delegates.
- Roslyn/source-to-callable work is deferred to runtime adapters governed by `docs/cadenza-language-runtime-contract.md`.
- Persistence and distribution remain outside core.
- JSON fixtures are conformance/interchange artifacts, not executable authority.

The repo also keeps C# meta-slice opportunities out of core. Policy evaluation, expansion-control reconciliation, PostgresActor backing reconcilers, capability planners, enterprise plugins, generated SDKs, and adapter validation remain later slices.

## Closure Criteria Assessment

| Criterion | Status | Notes |
| --- | --- | --- |
| Independent C# repo exists | Passed | `cadenza-csharp` is initialized as its own repo. |
| Modern .NET target | Passed | Uses `net10.0` with local SDK `10.0.301`. |
| Primitive identity rules | Passed | Tasks, helpers, globals, and actors are key-first; intents and signals are name-keyed. |
| Callable materialization boundary | Passed | Definitions require delegates; source/language fields are metadata. |
| Local execution semantics | Passed | Covers context merge, branch filtering, branch splitting, and unique fan-in. |
| Helper/global aliasing | Passed | Alias maps resolve by dependency key. |
| Intent/signal basics | Passed | Local inquiry and emission are implemented with current naming validation. |
| Actor core | Passed | Actor tasks enforce read/write mode and keyed local state. |
| Snapshots | Passed | Runtime snapshots are key-first and JSON-serializable. |
| Validation | Passed | Format, build, tests, harness, and diff checks passed. |

## Deferred Classification

These items should not block C# Pass 1 closure.

### Defer To C# Pass 2

- async-friendly APIs
- cancellation-token-aware local execution
- stronger typed schema/inquiry/signal envelopes
- immutable or read-only snapshot/global views
- richer C# edge-case tests around delegate shapes and JSON normalization
- expanded conformance fixture coverage to match mature TypeScript/Python/Elixir slices

### Defer To Runtime Adapter Design

- Roslyn source-to-callable materialization
- dependency lock policy
- source digest evidence
- capability injection
- sandbox/container policy
- runtime adapter lifecycle states

### Defer To Later Cadenza Layers

- persistence and hydration
- chamber/cell runtime substrate
- placement, distribution, orchestration, and scale
- policy engine implementation
- PostgresActor backing reconcilers
- expansion-control and capability-planner meta slices
- memory
- CLI

## Residual Risks

- C# conformance coverage is intentionally smaller than the mature Python and Elixir suites.
- The static in-memory facade is good for Pass 1, but later embedded/runtime scenarios may need explicit runtime instances.
- Current execution is synchronous; async/cancellation should be designed deliberately rather than bolted on.
- The C# type system can encourage richer API envelopes. Those should be added only when they preserve the shared primitive contract.

## Closure Recommendation

Close C# Pass 1 and close Sprint 1B as the official core translation foundation.

The next practical step is not another language translation by default. It is a Sprint 1B closure/readiness handoff into Sprint 2: define the shared conformance authority shape and decide which broader preparation concepts should come next before environment bootstrap.
