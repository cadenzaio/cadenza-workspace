# Elixir BEAM-Native Pass 2 Design

## Goal

- Outcome: Design the BEAM-native execution model for `cadenza-elixir` Pass 2 before implementing scheduler/concurrency semantics.
- Why it matters: Elixir can express concurrency, isolation, supervision, throttling, debounce, and signal delivery more directly than TypeScript or Python. The design must use those strengths without turning chamber/runtime/distribution concerns into core contract.

## Current Status

- State: `done`
- Current repo: `cadenza-elixir`
- Impacted repos:
  - `cadenza-elixir`
  - workspace docs

## Scope

- In scope:
  - BEAM-native runtime architecture proposal.
  - Scheduler semantics for task throttle/debounce.
  - Signal debounce/squash and richer local signal emission metadata.
  - Supervised or process-backed internals where they preserve the shared primitive contract.
  - Compatibility with existing Pass 1 facade and JSON conformance boundary.
  - Clear distinction between core local runtime and later chamber/cell/distribution layers.
- Out of scope:
  - Memory.
  - CLI.
  - Chamber runtime repository.
  - Cells, distribution, placement, persistence, actor sessions, orchestration, and scale.
  - Public macro DSL unless it is explicitly separated from execution internals.

## Questions Or Blockers

- Resolved for this slice: use application-owned OTP services for the runtime registry and private scheduler GenServers behind the existing facade.
- Resolved for this slice: task throttle/debounce are task execution policies; signal debounce/squash are signal delivery policies.
- Process topology remains private implementation detail; no public runtime object is introduced in this slice.

## Assumptions

- TypeScript `cadenza` remains the current contract authority for shared primitive meaning.
- Pass 1 facade should remain stable unless a change is justified by coherence and documented.
- JSON remains the shared conformance/interchange boundary, not executable authority or internal truth model.
- BEAM-native enrichments are allowed when they strengthen the intended whole and do not become cross-language requirements by accident.

## Validation

- Checks to run before implementation approval:
  - `mix format --check-formatted`
  - `mix compile --warnings-as-errors`
  - `mix test`
  - JSON conformance fixtures for implemented scheduler/signal cases
  - `./scripts/check-agent-harness.sh`
  - `git diff --check`
- Docs to update:
  - `cadenza-elixir/README.md`
  - `docs/cadenza-elixir-translation-readiness.md`
  - this execution plan
  - a design proposal or decision record if approved

## Progress - 2026-07-11

- Implemented private BEAM scheduler processes:
  - `Cadenza.Runtime.SignalScheduler`
  - `Cadenza.Runtime.TaskScheduler`
- Added signal delivery metadata:
  - `__signal_emission`
  - signal name
  - emitted timestamp
  - scheduled/debounced/squashed flags
- Added signal debounce and squash through timer-owned scheduler state.
- Added task throttle and debounce through keyed scheduler queues.
- Added `Cadenza.run_async(...)` for concurrent local execution tests.
- Added `Cadenza.create_throttled_task(...)`.
- Added `Cadenza.create_debounce_task(...)`.
- Expanded JSON conformance coverage:
  - `signal_metadata`
  - `signal_debounce`
  - `signal_squash`
  - `runtime_throttle`
  - `runtime_debounce`
- Added OTP application-owned runtime services:
  - `Cadenza.Application`
  - `Cadenza.Runtime`
  - `Cadenza.Runtime.SignalScheduler`
  - `Cadenza.Runtime.TaskScheduler`
- The lifecycle lesson from the failed lazy supervisor remains: supervision must be application-owned, not caller-owned.
- Matured the broad facade into private runtime modules while preserving the public API:
  - `Cadenza.Runtime.Executor`
  - `Cadenza.Runtime.SignalBus`
  - `Cadenza.Runtime.Snapshot`
  - `Cadenza.Runtime.ActorRunner`
- The current architecture keeps `Cadenza` as public composition surface and keeps execution, signal routing, snapshot export, and actor state mutation out of the facade.
- Split the broad runtime process into a private supervisor/facade and a dedicated registry service:
  - `Cadenza.Runtime` owns the private runtime supervision boundary.
  - `Cadenza.Runtime.Registry` owns local task/helper/global/intent/signal/actor definitions, observer/responder indexes, signal emissions, and actor state.
- The registry split keeps state ownership explicit without exposing a public runtime object or changing the facade contract.
- Closure review completed on 2026-07-12:
  - `docs/cadenza-elixir-pass-2-closure-review.md`
  - verdict: approved for closure
  - broader readiness-list items have been classified as close, defer to later core review, defer to later layers, defer until tags/layers exist, or optional Elixir enrichment
- User approved closing Elixir Pass 2 direction on 2026-07-12 while prioritizing the language runtime contract before Sprint 2.

## Exit Criteria

- A design proposal exists for Pass 2 BEAM-native runtime internals.
- The proposal identifies public contract versus private implementation detail.
- The proposal maps scheduler/signal semantics to fixture coverage.
- The user approves implementation with `Design approved. Proceed.`
- The user approves Pass 2 closure after reviewing `docs/cadenza-elixir-pass-2-closure-review.md`. Completed on 2026-07-12.
