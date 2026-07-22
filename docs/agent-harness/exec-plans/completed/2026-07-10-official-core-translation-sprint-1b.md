# Official Core Translation Sprint 1B

## Status

done

## Objective

Start the official polyglot core foundation by translating the stabilized TypeScript core into independent language repos and documenting the translation doctrine.

The sprint started as the Python translation sprint and expanded, by user direction, into Python, Elixir, and C# official core translations.

## Approval

- User asked on 2026-07-10 to start the Python translation in a new separate repo within the workspace.
- Translation readiness gate: [docs/cadenza-python-translation-readiness.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-python-translation-readiness.md)
- Callable materialization decision: [docs/decisions/2026-07-11-callable-materialization-boundary.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/decisions/2026-07-11-callable-materialization-boundary.md)

## Scope

- Create `cadenza-python` as a separate git repository.
- Implement the first shared core slice in Python:
  - key-first task identity
  - task execution and chaining
  - signal and intent naming validation
  - basic signal observation and emission
  - helper/global definitions and alias binding
  - callable-backed Python task definitions with optional source metadata
  - key-first runtime snapshots
  - actor identity, actor-bound tasks, keyed durable/runtime state, read/write boundaries, and idempotency basics
  - shared conformance fixture structure and Python runner
  - branch fan-out, iterable branch splitting, unique-task fan-in, retry, timeout, and concurrency controls
  - ephemeral, throttled, and debounced task variants
  - in-process signal scheduling, debounce, squash, and local emission metadata
  - schema constraints, intent input/output schemas, inquiry timeout modes, and responder ordering
  - portable schema snapshots and public schema validation/export helpers
- Add focused tests for the first conformance slice.
- Add workspace routing docs for the new repo.
- Create and mature `cadenza-elixir` as the second official translation, including a boring parity pass and a focused BEAM-native private-runtime pass.
- Create `cadenza-csharp` as the third official translation, starting with boring core parity before any C# runtime adapter or meta-slice work.
- Document the language role doctrine, language runtime adapter contract, meta-slice language fit review, Elixir closure review, and C# closure review.

## Out Of Scope

- Memory.
- CLI.
- Chamber runtime.
- Cells, distribution, placement, persistence, actor sessions, broadcast/delivery transport metadata, orchestration, and scale.
- Legacy service, DB, demo, and old runtime-host contracts.
- Non-standard-library runtime dependencies.

## Translation Choices For First Slice

- Python uses `snake_case` as the primary API spelling.
- `Cadenza.run(...)` returns the final context.
- `Cadenza.run_async(...)` is available for async callers.
- Core expects callable slots to already be materialized; serialized callable/source materialization belongs in a controlled cell/runtime layer.
- Python 3.10 is the initial local compatibility floor because that is the available interpreter in this workspace.
- `Cadenza.create_actor(...)` creates a local actor state authority.
- `actor.task(..., key="...")` returns a normal registered `Task`, so actor-bound work composes with the existing graph/signal/tool surface.

## Progress - 2026-07-10

- Created `cadenza-python` as an independent git repo.
- Added repo-local `AGENTS.md`, `README.md`, `pyproject.toml`, and `.gitignore`.
- Added package modules under `src/cadenza/`.
- Added initial unit tests under `tests/`.
- Added workspace repo card and workspace-map routing entries.
- Added Python-native decorator authoring surfaces:
  - `@Cadenza.task(...)`
  - `@Cadenza.helper(...)`
- Added docstring-derived descriptions for decorated tasks/helpers.
- Added `with Cadenza.isolated_runtime():` for temporary scoped runtime state.
- Added async-aware handler injection so async task/helper handlers receive awaitable signal emission.
- Added partial-timeout inquiry behavior and `Task.responds_to(...)` / `Task.inquires(...)`.
- Added task follow-up signal emission through `.emits(...)` and `.emits_on_fail(...)`.
- Added focused tests for decorators, isolated runtimes, async emission, inquiry timeout partials, signal follow-ups, and dataclass schema validation.
- Added the first actor core translation:
  - `Actor` and `ActorTaskContext`
  - `Cadenza.create_actor(...)`, `create_actor_from_definition(...)`, `get_actor_by_key(...)`, and `get_all_actors()`
  - `actor.task(...)` as a Python-native bound task/decorator surface
  - actor key identity and state-key resolution from explicit options, resolver, field/path/template definitions, or default key
  - durable/runtime state split
  - read/write mode enforcement
  - shallow patch and overwrite write contracts
  - idempotency basics for successful actor task executions
  - key-first actor snapshots
- Added focused actor tests for identity, state persistence, key resolution, runtime state, write boundaries, idempotency, snapshots, tools, and actor task decorators.
- Added helper/global definition materialization:
  - `Cadenza.create_helper_from_definition(...)`
  - `Cadenza.create_global_from_definition(...)`
- Added runtime-owned/source metadata to task/helper/global snapshots.
- Added actor task metadata to runtime snapshots.
- Added language-neutral JSON conformance fixtures under `cadenza-python/conformance/fixtures/`.
- Added a Python conformance fixture runner in `tests/test_conformance_fixtures.py`.
- Added direct definition/snapshot parity tests for helper/global definitions and actor definition round-tripping.
- Corrected the callable materialization boundary:
  - removed Python `eval`/`exec` source compilation from core
  - `create_task_from_definition(...)` and `create_helper_from_definition(...)` now require already-callable handlers
  - source/language fields remain optional metadata for snapshots
  - conformance runner performs fixture callable materialization before calling core
  - TypeScript authority repo was reviewed and updated to the same boundary
- Added runtime execution behavior parity:
  - branch fan-out through `.then(...)`
  - iterable task results as branch context splits
  - `Cadenza.create_unique_task(...)` fan-in with `joined_contexts`
  - retry and retry-count context metadata
  - timeout enforcement
  - per-task concurrency limits
  - `None` return filtering for successor execution
- Added task variant parity:
  - `Cadenza.create_ephemeral_task(...)` and `create_ephemeral_meta_task(...)`
  - `Cadenza.create_throttled_task(...)` and `create_throttled_meta_task(...)`
  - `Cadenza.create_debounce_task(...)` and `create_debounce_meta_task(...)`
  - destroyed-task filtering in direct runs, signal delivery, lookups, and snapshots
  - snapshot flags for ephemeral, throttled, and debounce task variants
- Added `conformance/fixtures/runtime_execution.json` for portable runtime behavior checks.
- Added in-process signal behavior parity:
  - delayed signal scheduling through `delay` / `schedule_async(...)`
  - debounce delivery using the latest payload
  - squash delivery by signal name or explicit `squash_id`
  - local `__signal_emission` metadata on delivered payloads
  - `signal_emissions` in runtime snapshots
- Added `conformance/fixtures/signal_behavior.json` for portable signal behavior checks.
- Added schema and inquiry parity:
  - numeric min/max and multiple-of constraints
  - string min/max length, pattern, enum, one-of, and email/url/date-time/uuid formats
  - array item validation and length constraints
  - intent input/output schemas
  - task schema-map merging through `Task.responds_to(...)`
  - inquiry input/output validation
  - ordered responder results
  - partial timeout results and reject-on-timeout behavior
- Added schema coherence cleanup:
  - `schema_to_dict(...)` for portable schema snapshot serialization
  - root package exports for schema validation/export helpers
  - JSON-serializable intent and task schema snapshots
- Added packaging and hygiene cleanup:
  - `py.typed` marker for downstream type-aware use
  - package-data config for the marker file
  - removed unnecessary type-ignore comments
  - renamed misleading actor runtime-state test identifiers that implied actor-session scope
- Added `conformance/fixtures/schema_inquiry.json` for portable schema and inquiry checks.
- Completed the post-Python readiness pass for the next translation:
  - recorded translation lessons from the Python implementation
  - confirmed the TypeScript/Python boundary around persistence-agnostic core and callable materialization
  - documented Elixir shared core, native expression, enrichment candidates, exclusions, decision gates, and first-slice recommendation in [docs/cadenza-elixir-translation-readiness.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-elixir-translation-readiness.md)

## Progress - 2026-07-11 To 2026-07-12

- Created `cadenza-elixir` as an independent official core translation repo.
- Completed Elixir Pass 1 boring core parity.
- Completed Elixir Pass 2 with private BEAM-native runtime internals while keeping process topology out of the public primitive contract.
- Added Elixir closure review in [docs/cadenza-elixir-pass-2-closure-review.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-elixir-pass-2-closure-review.md).
- Documented the language role doctrine in [docs/cadenza-language-role-doctrine.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-language-role-doctrine.md).
- Documented the runtime adapter materialization, containment, and evidence gate in [docs/cadenza-language-runtime-contract.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-language-runtime-contract.md).
- Documented meta-slice language fit in [docs/cadenza-meta-slice-language-fit-review.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-meta-slice-language-fit-review.md).
- Created `cadenza-csharp` as an independent official core translation repo.
- Implemented C# Pass 1 boring core parity:
  - task identity, execution, branch filtering, branch splitting, and unique fan-in
  - helpers and globals
  - intents and local inquiry
  - signals and local observers
  - callable-backed definitions from delegates
  - actors with keyed durable/runtime state and read/write mode enforcement
  - key-first snapshots
- Added C# closure review in [docs/cadenza-csharp-closure-review.md](https://github.com/cadenzaio/cadenza-workspace/blob/main/docs/cadenza-csharp-closure-review.md).
- Added workspace routing docs and decision records for the official translation repos.

## Validation

- `cd cadenza-python && python3 -m compileall src tests`
- `cd cadenza-python && PYTHONPATH=src python3 -m unittest discover -s tests`
- `cd cadenza-elixir && mix test`
- `cd cadenza-csharp && dotnet format --verify-no-changes`
- `cd cadenza-csharp && dotnet build`
- `cd cadenza-csharp && dotnet test`
- `./scripts/check-agent-harness.sh`
- `git diff --check` in workspace root
- `git diff --check` in `cadenza-python`
- `git diff --check` in `cadenza-csharp`

## Exit Criteria

- Python repo exists independently from the TypeScript repo.
- First shared core slice is implemented and tested.
- Workspace routing docs point future agents to the Python translation readiness note and repo contract.
- Validation passes.
- Elixir repo exists independently and has a closure review classifying BEAM-native work and deferred scope.
- C# repo exists independently and has a closure review classifying Pass 1 parity and deferred runtime adapter/meta-slice scope.
- Language translation doctrine and runtime adapter contract are documented before Sprint 2.

## Closure

Sprint 1B is complete as the official core translation foundation.

The official core family now has TypeScript as authority and Python, Elixir, and C# as translation repos. Further language work should not continue by default. Additional language repos need a concrete reason tied to business-logic authoring, a specific meta slice, or runtime adapter demand.

The next sprint should move from translation foundation into Sprint 2 preparation: shared conformance authority, tag/layer groundwork, runtime adapter boundaries, and environment-bootstrap readiness.
