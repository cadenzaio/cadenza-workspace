# Elixir Translation Pass 1

## Status

done

Moved to completed on 2026-07-12 after Elixir Pass 2 closure.

## Objective

Create `cadenza-elixir` as the next official language translation repo and begin Pass 1: boring core parity.

## Approval

- User approved Elixir as the next translation target on 2026-07-11.
- User approved the two-pass plan: first boring parity, then focused Elixir-native completeness.
- Readiness gate: [docs/cadenza-elixir-translation-readiness.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-elixir-translation-readiness.md)

## Scope

- Create `cadenza-elixir` as an independent repo.
- Add repo-local `AGENTS.md`, README, formatter, and ExUnit setup.
- Implement the first boring shared-core slice:
  - stable task key identity
  - task creation
  - context execution
  - return-map merge semantics
  - branch filtering for `nil` returns
  - task chaining
  - key-first runtime snapshot basics
- Add focused ExUnit tests for this slice.

## Out Of Scope

- Memory.
- CLI.
- Chamber runtime.
- Cells, distribution, placement, persistence, actor sessions, broadcast/delivery transport metadata, orchestration, and scale.
- External durable-state hydration.
- Strict write-through persistence intents.
- BEAM-native macro DSL, process-backed architecture, supervised isolated runtimes, and message-passing signal internals.
- Helpers, globals, signals, intents, schemas, actors, and full conformance runner unless they are needed to stabilize the first task slice.

## Validation

- `mix format --check-formatted`
- `mix test`
- `./scripts/check-agent-harness.sh`
- `git diff --check`

## Progress - 2026-07-11

- Created `cadenza-elixir` as a Mix project with app identity `:cadenza` and module namespace `Cadenza`.
- Initialized `cadenza-elixir` as an independent git repo.
- Added repo-local `AGENTS.md` and README with Pass 1/Pass 2 boundaries.
- Added the first boring task primitive slice:
  - `Cadenza.Task`
  - `Cadenza.Runtime`
  - `Cadenza.Naming`
  - `Cadenza.create_task(...)`
  - `Cadenza.then(...)`
  - `Cadenza.run(...)`
  - `Cadenza.snapshot_runtime(...)`
  - `Cadenza.get_task_by_key(...)`
- Added ExUnit coverage for stable task keys, duplicate-key rejection, context merge, key-based runs, chaining, nil branch filtering, list-result branch splitting, and key-first snapshots.
- Added workspace repo card and workspace-map routing for `cadenza-elixir`.
- Added the first helper/global slice:
  - `Cadenza.Helper`
  - `Cadenza.Global`
  - `Cadenza.create_helper(...)`
  - `Cadenza.create_global(...)`
  - `Cadenza.use_helper(...)`
  - `Cadenza.use_global(...)`
  - `Cadenza.get_helper_by_key(...)`
  - `Cadenza.get_global_by_key(...)`
  - arity-two task handlers that receive alias-scoped `tools`
- Added ExUnit coverage for helper/global identity, duplicate-key rejection, explicit alias injection, and key-first tool snapshots.
- Added the first signal/intent naming slice:
  - `Cadenza.Intent`
  - `Cadenza.Signal`
  - lowercase kebab-case intent validation
  - lowercase dot-separated signal validation with optional exact tags
  - `Cadenza.define_intent(...)`
  - `Cadenza.define_signal(...)`
  - `Cadenza.get_intent(...)`
  - `Cadenza.get_signal(...)`
  - intent/signal runtime snapshots
- Added ExUnit coverage for valid names, duplicate names, invalid names, and snapshot export.
- Added callable-backed definition materialization:
  - `Cadenza.create_task_from_definition(...)`
  - `Cadenza.create_helper_from_definition(...)`
  - `Cadenza.create_global_from_definition(...)`
  - source/language fields retained as metadata only
  - task/helper definitions reject source-only handlers without already-materialized callables
- Added ExUnit coverage for definition-backed task/helper/global materialization and callable-boundary rejection.
- Added basic in-process signal behavior:
  - `Cadenza.observe_signal(...)`
  - `Cadenza.emit(...)`
  - implicit signal definition on observation or emission
  - synchronous local observer task execution
  - observer tasks can continue through existing task links
  - observed signals in task snapshots
- Added ExUnit coverage for local signal delivery, no-observer emission, multiple observers, linked observer continuation, and snapshot metadata.
- Added the first actor slice using `%Cadenza.ActorContext{}`:
  - `Cadenza.Actor`
  - `Cadenza.ActorContext`
  - `Cadenza.create_actor(...)`
  - `Cadenza.create_actor_task(...)`
  - `Cadenza.get_actor_by_key(...)`
  - `Cadenza.get_actor_state(...)`
  - local keyed durable/runtime actor state
  - read/write mode enforcement
  - actor and actor-task snapshot metadata
- Added ExUnit coverage for actor identity, duplicate actor keys, durable state writes, explicit actor state keys, read-mode write rejection, runtime state writes, and snapshots.
- Added the first inquiry/responders slice:
  - `Cadenza.responds_to(...)`
  - `Cadenza.inquire(...)`
  - explicit intent definition required before responder registration or inquiry
  - synchronous local responder execution
  - joined response context
  - partial-result metadata through `max_responses` and `include_meta`
  - handled-intent task snapshot metadata
- Added ExUnit coverage for responder joins, partial inquiry metadata, missing-intent rejection, and snapshot export.
- Added the first schema slice:
  - `Cadenza.Schema`
  - `Cadenza.validate_schema(...)`
  - `Cadenza.schema_to_map(...)`
  - primitive/object/array validation
  - required fields, strict mode, string/number/list constraints, pattern, enum/oneOf, and basic format checks
  - intent input/output schema validation during local inquiry
  - responder task schema variants in snapshots
- Added ExUnit coverage for schema constraints, strict fields, intent input/output validation, invalid responder output, and JSON-shaped schema snapshots.

## Decision - JSON Conformance Boundary

Resolved on 2026-07-11: JSON remains the shared conformance/interchange boundary. The relational/database model may remain the future authority and project into JSON as needed; JSON is not the internal truth model for every implementation.

- Added `Jason` as a dev/test dependency.
- Added `test/conformance_fixture_test.exs`.
- The runner decodes shared JSON fixtures and materializes callable slots inside the test harness only.
- Snapshot outputs are JSON-encoded to verify the interchange boundary.
- Covered fixture subsets:
  - `core_identity.json`
  - `definitions_snapshot.json`
  - `schema_inquiry.json`
  - `runtime_execution.json` for retry and ephemeral cases
- Runtime fixture kinds explicitly not yet supported in Elixir Pass 1:
  - `runtime_throttle`
  - `runtime_debounce`
- Added actor definition materialization:
  - `Cadenza.create_actor_from_definition(...)`
- Added runtime task lifecycle primitives:
  - `Cadenza.create_ephemeral_task(...)`
  - `retry_count` support for local task execution
- Added boring synchronous unique fan-in:
  - `Cadenza.create_unique_task(...)`
  - run-local unique join state
  - `joined_contexts` passed to the unique task handler after all direct predecessors arrive
  - stale task handles now resolve current runtime task state before mutation so repeated `then(...)` calls remain additive

## Deferred To Pass 2 - Scheduler Semantics

The remaining runtime conformance fixture cases require architectural decisions rather than small parity patches:

- Throttle and debounce need scheduler/concurrency semantics.
- Elixir can express these well through BEAM-native tasks/processes, but Pass 1 has deliberately avoided making process architecture public contract.

Decision on 2026-07-11: close boring Pass 1 and defer throttle/debounce/squash scheduler semantics to a deeper Elixir/BEAM-native design.

## Completion - 2026-07-11

Pass 1 is closed as boring core parity for non-scheduler semantics.

Final validation:

- `mix format --check-formatted`
- `mix compile --warnings-as-errors`
- `mix test` -> 44 tests, 0 failures
- `./scripts/check-agent-harness.sh`
- `git diff --check`

## Exit Criteria

- `cadenza-elixir` exists as an independent repo.
- The repo contract makes Pass 1 and Pass 2 boundaries clear.
- The first task primitive slice passes tests.
- Workspace docs route agents to the Elixir readiness note and repo card.
